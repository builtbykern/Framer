/**
 * Flat CTA/hero coherence report + apply clear fixes.
 */
const NL = String.fromCharCode(10)
const pages = await framer.getNodesWithType("WebPageNode")

function findAll(n, pred, acc = []) {
    if (!n) return acc
    if (pred(n)) acc.push(n)
    for (const c of n.children || []) findAll(c, pred, acc)
    return acc
}

function flat(n) {
    const a = n.attributes || {}
    return {
        id: n.id,
        name: n.name || "",
        padding: a.padding || null,
        gap: a.gap || null,
        maxWidth: a.maxWidth || null,
        width: a.width || null,
        fill: a.backgroundColor || a.fill || null,
        link: a.link?.href || a.link || null,
        display: a.$componentDisplayName || null,
        childNames: (n.children || []).map((c) => c.name || c.type).slice(0, 8),
    }
}

const report = { enquiry: [], continue: [], heroes: [], journalBtn: [], journalStrip: [] }

for (const p of pages || []) {
    if (!p.path || p.path === "/404") continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 8 }, {})
    for (const bp of ser.children || []) {
        for (const n of findAll(bp, (x) => x.name === "Enquiry CTA")) {
            const inner = (n.children || []).find((c) => c.type === "FrameNode")
            report.enquiry.push({
                path: p.path,
                bp: bp.name,
                shell: flat(n),
                inner: inner ? flat(inner) : null,
                btn: inner
                    ? flat(
                          (inner.children || []).find(
                              (c) => c.type === "FrameNode" && (c.attributes?.link || c.name),
                          ) || { attributes: {} },
                      )
                    : null,
            })
        }
        for (const n of findAll(bp, (x) => x.name === "Continue Your Search")) {
            report.continue.push({ path: p.path, bp: bp.name, ...flat(n) })
        }
        for (const n of findAll(
            bp,
            (x) =>
                /^(Hero Section|Contact Hero|Property Hero|Properties Hero|Neighbourhoods Hero|Notes Hero|Beat 1 — Portrait Stage|Article Hero Meta)$/.test(
                    x.name || "",
                ),
        )) {
            report.heroes.push({ path: p.path, bp: bp.name, ...flat(n) })
        }
        for (const n of findAll(bp, (x) => x.name === "Journal Button")) {
            report.journalBtn.push({
                path: p.path,
                bp: bp.name,
                id: n.id,
                controls: Object.fromEntries(
                    Object.entries(n.attributes || {}).filter(([k]) => k.startsWith("$control")),
                ),
            })
        }
        // Journal listing strips (Home/Contact) named Journal at depth~1 with Content Area child
        for (const n of findAll(
            bp,
            (x) =>
                x.name === "Journal" &&
                (x.children || []).some((c) => /content area|journal deck/i.test(c.name || "")),
        )) {
            report.journalStrip.push({ path: p.path, bp: bp.name, ...flat(n) })
        }
    }
}

// --- Fixes ---
const fixes = []

// 1) Enquiry CTA: Phone gap on /properties is 20 → 24
for (const e of report.enquiry) {
    if (e.shell.gap === "20px") {
        fixes.push({ id: e.shell.id, set: `gap="24px"`, note: `${e.path} ${e.bp} Enquiry gap 20→24` })
    }
}

// 2) Enquiry CTA: unify inner content gap Desktop 32 vs Tablet/Phone 24 → keep D32, ensure all have maxWidth on shell 1200 where missing
for (const e of report.enquiry) {
    if (!e.shell.maxWidth && e.bp === "Desktop") {
        fixes.push({
            id: e.shell.id,
            set: `maxWidth="1200px"`,
            note: `${e.path} Desktop Enquiry maxWidth→1200`,
        })
    }
}

// 3) Contact Phone Hero: missing padding → S pad with gutter
for (const h of report.heroes) {
    if (h.path === "/contact" && h.name === "Contact Hero" && h.bp === "Phone" && !h.padding) {
        fixes.push({
            id: h.id,
            set: `padding="0px 16px 40px 16px" gap="24px"`,
            note: "Contact Phone Hero pad+gap",
        })
    }
}

// 4) Journal strips: Contact Phone gap 32 → 40 to match Home; Contact Desktop 48 → 40
for (const j of report.journalStrip) {
    if (j.path === "/contact" && j.gap === "48px") {
        fixes.push({ id: j.id, set: `gap="40px"`, note: `Contact ${j.bp} Journal gap 48→40` })
    }
    if (j.path === "/contact" && j.bp === "Phone" && j.gap === "32px") {
        fixes.push({ id: j.id, set: `gap="40px"`, note: "Contact Phone Journal gap 32→40" })
    }
    if (j.path === "/contact" && !j.maxWidth) {
        fixes.push({
            id: j.id,
            set: `maxWidth="1200px"`,
            note: `Contact ${j.bp} Journal maxWidth→1200`,
        })
    }
}

// 5) Journal Button hard RGB → Racing + Paper tokens
const RACING = "var(--token-425191b0-a245-4f14-88c2-f7144ab54959)" // verify - Enquiry fill uses this (Racing?)
const PAPER = "var(--token-d5b3c09d" // incomplete - get from styles

const styles = await framer.getColorStyles()
const byName = Object.fromEntries((styles || []).map((s) => [s.name, s]))
const racing = byName["Racing"] || byName["racing"]
const paper = byName["Paper"] || byName["paper"]
const ink = byName["Ink"] || byName["ink"]

for (const b of report.journalBtn) {
    const fill = b.controls.$control__fill || ""
    if (fill.startsWith("rgb") && racing) {
        fixes.push({
            id: b.id,
            set: `$control__fill="${racing.id ? `var(--token-${racing.id})` : fill}" $control__text="${paper ? `var(--token-${paper.id})` : b.controls.$control__text}"`,
            note: `Journal Button ${b.bp} fill/text → tokens`,
            raw: { racing, paper, fill },
        })
    }
}

// Color style ids in Framer often already in path — check format
const colorFixLines = []
if (racing && paper) {
    // getColorStyles returns id like uuid - token form var(--token-uuid)
    const racingTok = `var(--token-${racing.id})`
    const paperTok = `var(--token-${paper.id})`
    // Actually color styles use different id format - check existing Enquiry fill
    // Enquiry uses var(--token-425191b0-a245-4f14-88c2-f7144ab54959) - that's the style id
    for (const b of report.journalBtn) {
        colorFixLines.push(
            `SET ${b.id} $control__fill="${racingTok}" $control__text="${paperTok}";`,
        )
    }
}

const lines = []
for (const f of fixes) {
    if (f.note.includes("Journal Button")) continue // handled below
    lines.push(`SET ${f.id} ${f.set};`)
}
lines.push(...colorFixLines)

const byId = new Map()
// dedupe SETs on same id by merging — apply sequentially per unique id last-wins for same prop
const result =
    lines.length > 0
        ? await framer.agent.applyChanges(lines.join(NL), {})
        : { message: "nothing" }

return {
    enquirySummary: report.enquiry.map((e) => ({
        path: e.path,
        bp: e.bp,
        pad: e.shell.padding,
        gap: e.shell.gap,
        maxW: e.shell.maxWidth,
        innerGap: e.inner?.gap,
        innerMax: e.inner?.maxWidth,
        btnPad: e.btn?.padding,
        btnFill: e.btn?.fill,
        btnLink: e.btn?.link,
    })),
    continueSummary: report.continue,
    heroesSummary: report.heroes,
    journalStrip: report.journalStrip,
    journalBtn: report.journalBtn,
    colorStyles: (styles || []).map((s) => ({ name: s.name, id: s.id, path: s.path })),
    fixes: fixes.map((f) => f.note),
    lines,
    result,
}

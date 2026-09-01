/**
 * CTA/hero pass 2 — Enquiry button + inner gaps + hero maxWidth.
 */
const NL = String.fromCharCode(10)
const pages = await framer.getNodesWithType("WebPageNode")

function findAll(n, pred, acc = []) {
    if (!n) return acc
    if (pred(n)) acc.push(n)
    for (const c of n.children || []) findAll(c, pred, acc)
    return acc
}

const lines = []
const notes = []

for (const p of pages || []) {
    if (!p.path || p.path === "/404") continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 8 }, {})
    for (const bp of ser.children || []) {
        // Enquiry CTA shells + inners + buttons
        for (const shell of findAll(bp, (x) => x.name === "Enquiry CTA")) {
            const a = shell.attributes || {}
            if (!a.maxWidth) {
                lines.push(`SET ${shell.id} maxWidth="1200px";`)
                notes.push(`${p.path} ${bp.name} Enquiry maxWidth→1200`)
            }
            if (a.gap && a.gap !== "24px") {
                lines.push(`SET ${shell.id} gap="24px";`)
                notes.push(`${p.path} ${bp.name} Enquiry gap→24`)
            }
            const inner = (shell.children || []).find((c) => c.type === "FrameNode")
            if (inner) {
                const ig = inner.attributes?.gap
                const targetInner =
                    bp.name === "Desktop" ? "32px" : bp.name === "Tablet" ? "24px" : "24px"
                if (ig && ig !== targetInner) {
                    lines.push(`SET ${inner.id} gap="${targetInner}";`)
                    notes.push(`${p.path} ${bp.name} Enquiry inner gap ${ig}→${targetInner}`)
                }
                // CTA button frame = child with link to /contact
                const btn = (inner.children || []).find(
                    (c) => c.type === "FrameNode" && c.attributes?.link,
                )
                if (btn) {
                    const gold =
                        bp.name === "Desktop"
                            ? "16px 32px 16px 32px"
                            : bp.name === "Tablet"
                              ? "16px 28px 16px 28px"
                              : "16px 24px 16px 24px"
                    const cur = btn.attributes?.padding || ""
                    if (cur !== gold) {
                        lines.push(`SET ${btn.id} padding="${gold}";`)
                        notes.push(`${p.path} ${bp.name} Enquiry btn pad ${cur}→${gold}`)
                    }
                }
            }
        }

        // Property Hero phone maxWidth
        for (const h of findAll(bp, (x) => x.name === "Property Hero")) {
            if (!h.attributes?.maxWidth) {
                lines.push(`SET ${h.id} maxWidth="1200px";`)
                notes.push(`${p.path} ${bp.name} Property Hero maxWidth→1200`)
            }
        }

        // Neighbourhoods Hero: Desktop gap 0; T/P had 20/16 — snap to 0 for same stack contract
        for (const h of findAll(bp, (x) => x.name === "Neighbourhoods Hero")) {
            const g = h.attributes?.gap
            if (g && g !== "0px" && bp.name !== "Desktop") {
                lines.push(`SET ${h.id} gap="0px";`)
                notes.push(`${p.path} ${bp.name} Neighbourhoods Hero gap→0`)
            }
        }

        // Notes listing Journal shell maxWidth on T/P
        if (p.path === "/notes") {
            for (const j of findAll(
                bp,
                (x) =>
                    x.name === "Journal" &&
                    (x.children || []).some((c) => c.name === "Notes Hero" || c.name === "Content Area"),
            )) {
                if (!j.attributes?.maxWidth && bp.name !== "Desktop") {
                    lines.push(`SET ${j.id} maxWidth="1200px";`)
                    notes.push(`Notes ${bp.name} Journal maxWidth→1200`)
                }
            }
        }

        // Journal button border → Ink alpha token if hard rgba
        for (const b of findAll(bp, (x) => x.name === "Journal Button")) {
            const border = b.attributes?.$control__border
            if (border && String(border).startsWith("rgba")) {
                // Ink @ 0.18 — keep rgba but document; optional use Ink Soft — skip if no opacity token
            }
        }
    }
}

const result = lines.length
    ? await framer.agent.applyChanges(lines.join(NL), {})
    : { message: "noop" }

return { n: lines.length, notes, result }

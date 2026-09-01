/**
 * Full-site adaptation pass:
 * 1) Content nodes: maxWidth 90% + width 1fr → width 90% (Framer ignores maxW% with 1fr)
 * 2) Visual heroes: uncap shell so media bleeds; keep text column at 90%
 * 3) Alt-fill sections under Paper parent: full-bleed shell + horizontal pad 5%
 * 4) PrincipalProfile: unlock 1104px → 100%
 * 5) Footer Tablet rails → vh; Neighbourhood Feature height → vh
 */
const NL = String.fromCharCode(10)
const CONTENT = [
    "/",
    "/properties",
    "/neighbourhoods",
    "/notes",
    "/about",
    "/contact",
    "/properties/:slug",
    "/notes/:slug",
]

const PAPER = "var(--token-d5b3c09d-0364-4ed0-8804-e56957faa275)"
const SKIP = /Atmosphere|Nav$|Cue|ScrollCue|Noise|Mesh|Gradient Overlay|Image Layer|Bottom Parallax|Arbour_StopScroll|Drawer/i

const lines = []
const log = []

function fillStr(a = {}) {
    const f = a.fill ?? a.backgroundColor
    return f ? String(f) : null
}

function isPaperish(f) {
    if (!f) return false
    return f.includes("d5b3c09d-0364-4ed0-8804-e56957faa275") || f === PAPER
}

function padToFluidGutters(pad) {
    if (!pad || typeof pad !== "string") return null
    // top right bottom left OR top/bottom horizontal
    const parts = pad.trim().split(/\s+/)
    if (parts.length === 4) {
        const [t, , b] = parts
        return `${t} 5% ${b} 5%`
    }
    if (parts.length === 2) {
        return `${parts[0]} 5%`
    }
    if (parts.length === 1) {
        return null
    }
    if (parts.length === 3) {
        return `${parts[0]} 5% ${parts[2]}`
    }
    return null
}

function setWidth90(id, name, path, bp) {
    lines.push(`SET ${id} width="90%";`)
    lines.push(`SET ${id} maxWidth="90%";`)
    log.push(`${path}|${bp}|${name} → width 90%`)
}

function uncapShell(id, name, path, bp) {
    lines.push(`SET ${id} width="100%";`)
    // clear maxWidth — Framer DSL: set to null via empty? try 100%
    lines.push(`SET ${id} maxWidth="100%";`)
    log.push(`${path}|${bp}|${name} → shell bleed`)
}

function walkContent(n, ctx, d = 0) {
    if (!n || d > 9) return
    const name = n.name || "(unnamed)"
    if (SKIP.test(name) && d > 0) {
        for (const c of n.children || []) walkContent(c, ctx, d + 1)
        return
    }
    const a = n.attributes || {}
    const mw = a.maxWidth != null ? String(a.maxWidth) : null
    const w = a.width != null ? String(a.width) : null
    const fill = fillStr(a)
    const pad = a.padding != null ? String(a.padding) : null

    // Hero shells that must bleed
    const isHomeHero = name === "Hero Section"
    const isPropHero = name === "Property Hero"
    const isJournalHero = name === "Journal Hero Image"
    const isBeat2 = /Beat 2/i.test(name)
    const isBottom = name === "Bottom" && ctx.path === "/"

    if (isHomeHero || isPropHero) {
        uncapShell(n.id, name, ctx.path, ctx.bp)
        // keep horizontal pad on property hero as fluid gutters if present
        if (isPropHero && pad && /48px|40px|16px/.test(pad)) {
            const np = padToFluidGutters(pad)
            if (np) {
                lines.push(`SET ${n.id} padding="${np}";`)
                log.push(`${ctx.path}|${ctx.bp}|${name} pad→${np}`)
            }
        }
        for (const c of n.children || []) walkContent(c, ctx, d + 1)
        return
    }

    if (isJournalHero || isBeat2 || isBottom) {
        // ensure uncapped
        if (mw && mw !== "100%") {
            uncapShell(n.id, name, ctx.path, ctx.bp)
        }
        for (const c of n.children || []) walkContent(c, ctx, d + 1)
        return
    }

    // Alt-fill content section (not paper) with 90% — make bleed + 5% pad
    const altFill =
        fill &&
        !isPaperish(fill) &&
        mw === "90%" &&
        d <= 3 &&
        !/Image|Media|Portrait|Photo|Card/i.test(name)

    if (altFill) {
        uncapShell(n.id, name, ctx.path, ctx.bp)
        if (pad) {
            const np = padToFluidGutters(pad)
            if (np) {
                lines.push(`SET ${n.id} padding="${np}";`)
                log.push(`${ctx.path}|${ctx.bp}|${name} altFill pad→${np}`)
            }
        }
        // kids that already have 90% → force width 90%
        for (const c of n.children || []) {
            const ca = c.attributes || {}
            const cmw = ca.maxWidth != null ? String(ca.maxWidth) : null
            if (cmw === "90%" || (!cmw && !SKIP.test(c.name || ""))) {
                // only bump explicit 90% kids; leave editorial narrow cols
                if (cmw === "90%") setWidth90(c.id, c.name || "(x)", ctx.path, ctx.bp)
            }
            walkContent(c, ctx, d + 1)
        }
        return
    }

    // Standard content: maxWidth 90% → width 90%
    if (mw === "90%") {
        if (w !== "90%") setWidth90(n.id, name, ctx.path, ctx.bp)
    }

    for (const c of n.children || []) walkContent(c, ctx, d + 1)
}

const pages = await framer.getNodesWithType("WebPageNode")
for (const path of CONTENT) {
    const p = pages.find((x) => x.path === path)
    if (!p) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 8 }, {})
    for (const bp of ser.children || []) {
        for (const top of bp.children || []) {
            if (/Atmosphere|Cue|ScrollCue/i.test(top.name || "")) continue
            // skip Nav instance — handled via component
            if ((top.name || "") === "Nav") continue
            walkContent(top, { path, bp: bp.name || "?" }, 1)
        }
    }
}

// Nav component — top bars
const comps = await framer.getNodesWithType("ComponentNode")
const nav = comps.find((c) => c.name === "Nav")
if (nav) {
    const ser = await framer.agent.serialize({ id: nav.id, depth: 5 }, {})
    for (const v of ser.children || []) {
        const top = (v.children || []).find((c) => c.name === "top")
        if (top) {
            setWidth90(top.id, `Nav/${v.name}/top`, "comp:Nav", v.name)
        }
    }
}

// Footer editorial grid + tablet rails
const foot = comps.find((c) => c.name === "Footer")
if (foot) {
    const ser = await framer.agent.serialize({ id: foot.id, depth: 5 }, {})
    for (const v of ser.children || []) {
        const grid = (v.children || []).find((c) => /Editorial Grid/i.test(c.name || ""))
        if (grid) {
            const a = grid.attributes || {}
            if (String(a.maxWidth || "") === "90%" || String(a.width || "") === "1fr") {
                setWidth90(grid.id, `Footer/${v.name}/Editorial Grid`, "comp:Footer", v.name)
            }
        }
        const bar = (v.children || []).find((c) => /copyright|bar|Legal/i.test(c.name || ""))
        if (bar) {
            const a = bar.attributes || {}
            if (String(a.maxWidth || "") === "90%") {
                setWidth90(bar.id, `Footer/${v.name}/${bar.name}`, "comp:Footer", v.name)
            }
        }
        if (/Tablet/i.test(v.name || "")) {
            const rail = (v.children || []).find((c) => /Property Rail/i.test(c.name || ""))
            if (rail) {
                const map = {
                    "Rail Property 01": "24vh",
                    "Rail Property 02": "20vh",
                    "Rail Property 03": "30vh",
                    "Rail Property 04": "22vh",
                    "Rail Property 05": "18vh",
                }
                for (const rp of rail.children || []) {
                    const h = map[rp.name]
                    if (!h) continue
                    lines.push(`SET ${rp.id} height="${h}";`)
                    lines.push(`SET ${rp.id} minHeight="${h}";`)
                    log.push(`Footer|Tablet|${rp.name} → ${h}`)
                }
            }
        }
    }
}

// PrincipalProfile unlock
const pp = comps.find((c) => c.name === "Arbour_PrincipalProfile")
if (pp) {
    const ser = await framer.agent.serialize({ id: pp.id, depth: 2 }, {})
    for (const v of ser.children || []) {
        lines.push(`SET ${v.id} width="100%";`)
        lines.push(`SET ${v.id} maxWidth="100%";`)
        log.push(`PrincipalProfile|${v.name} → 100%`)
    }
}

// Neighbourhood Feature height
const nf = comps.find((c) => c.name === "Arbour Neighbourhood Feature")
if (nf) {
    const ser = await framer.agent.serialize({ id: nf.id, depth: 2 }, {})
    for (const v of ser.children || []) {
        const a = v.attributes || {}
        if (a.height && String(a.height).endsWith("px")) {
            lines.push(`SET ${v.id} height="42vh";`)
            log.push(`NeighbourhoodFeature|${v.name} → 42vh`)
        }
    }
}

// Home Text Content Column explicit (all BPs) — find by name walk already handles
// Extra: Phone Bottom uncap if capped
for (const path of ["/"]) {
    const p = pages.find((x) => x.path === path)
    const ser = await framer.agent.serialize({ id: p.id, depth: 3 }, {})
    for (const bp of ser.children || []) {
        const bottom = (bp.children || []).find((c) => c.name === "Bottom")
        if (bottom && String(bottom.attributes?.maxWidth || "") === "90%") {
            uncapShell(bottom.id, "Bottom", path, bp.name)
        }
        const hero = (bp.children || []).find((c) => c.name === "Hero Section")
        const text = hero && (hero.children || []).find((c) => c.name === "Text Content Column")
        if (text) setWidth90(text.id, "Text Content Column", path, bp.name)
    }
}

// Deduplicate SET lines (last wins — keep order unique by id+prop)
const seen = new Set()
const deduped = []
for (const line of lines) {
    const m = line.match(/^SET (\S+) (\w+)=/)
    if (!m) {
        deduped.push(line)
        continue
    }
    const key = `${m[1]}:${m[2]}`
    if (seen.has(key)) {
        // replace previous
        const idx = deduped.findIndex((l) => l.startsWith(`SET ${m[1]} ${m[2]}=`))
        if (idx >= 0) deduped[idx] = line
        continue
    }
    seen.add(key)
    deduped.push(line)
}

const CHUNK = 80
const results = []
for (let i = 0; i < deduped.length; i += CHUNK) {
    const chunk = deduped.slice(i, i + CHUNK).join(NL)
    const r = await framer.agent.applyChanges(chunk, {})
    results.push({
        i,
        errors: r.errors || r.error || null,
        warnings: (r.warnings || []).slice(0, 3),
    })
}

return {
    applied: deduped.length,
    logCount: log.length,
    sample: log.slice(0, 60),
    results,
}

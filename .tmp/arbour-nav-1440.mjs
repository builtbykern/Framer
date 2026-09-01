/**
 * Nav: full-bleed shell; top bar content maxWidth 1440 (align with page sections).
 * - Move horizontal padding from variant root → top row where needed
 * - SET top maxWidth=1440px, width=1fr on all variants
 * - Center variant stacks; keep drawer overlays full-bleed
 */
const comps = await framer.getNodesWithType("ComponentNode")
const nav = comps.find((c) => c.name === "Nav")
if (!nav) return { error: "no Nav component" }

const ser = await framer.agent.serialize({ id: nav.id, depth: 4 }, {})
const lines = []
const notes = []

for (const bp of ser.children || []) {
    const a = bp.attributes || {}
    // Center children so top maxWidth centers on ultrawide
    if (a.stackAlignment !== "center") {
        lines.push(`SET ${bp.id} stackAlignment="center";`)
        notes.push(`${bp.name} align→center`)
    }

    // Strip horizontal padding from variant root (keep vertical)
    const pad = String(a.padding || "")
    const parts = pad.match(/([\d.]+)px/g)
    if (parts && parts.length === 4) {
        const t = parts[0],
            r = parts[1],
            b = parts[2],
            l = parts[3]
        if (r !== "0px" || l !== "0px") {
            lines.push(`SET ${bp.id} padding="${t} 0px ${b} 0px";`)
            notes.push(`${bp.name} root pad L/R→0 (was ${pad})`)
        }
    } else if (parts && parts.length === 2) {
        // V H — zero out H
        const v = parts[0],
            h = parts[1]
        if (h !== "0px") {
            lines.push(`SET ${bp.id} padding="${v} 0px";`)
            notes.push(`${bp.name} root pad H→0 (was ${pad})`)
        }
    }

    const top = (bp.children || []).find((c) => c.name === "top")
    if (!top) {
        notes.push(`${bp.name} NO top`)
        continue
    }
    const ta = top.attributes || {}

    if (ta.maxWidth !== "1440px") {
        lines.push(`SET ${top.id} maxWidth="1440px";`)
        notes.push(`${bp.name}|top →1440`)
    }
    if (ta.width !== "1fr" && ta.width !== "100%") {
        lines.push(`SET ${top.id} width="1fr";`)
        notes.push(`${bp.name}|top width→1fr`)
    }

    // Ensure horizontal gutters on top (D48 / T40 / P16)
    const isPhone = /Phone/i.test(bp.name)
    const isTablet = /Tablet/i.test(bp.name)
    const gutter = isPhone ? "16px" : isTablet ? "40px" : "48px"
    const desired = `16px ${gutter} 16px ${gutter}`
    // Phone closed uses padding="16px" — expand to 4-value with gutter
    const tpad = String(ta.padding || "")
    if (tpad !== desired) {
        // preserve existing if already has correct gutter
        const tp = tpad.match(/([\d.]+)px/g) || []
        let need = true
        if (tp.length === 4 && tp[1] === gutter && tp[3] === gutter) need = false
        if (tp.length === 2 && tp[1] === gutter) need = false
        if (need) {
            lines.push(`SET ${top.id} padding="${desired}";`)
            notes.push(`${bp.name}|top pad→${desired}`)
        }
    }
}

// Ensure all page Nav instances are full-bleed (no maxWidth, width 100%)
const pages = await framer.getNodesWithType("WebPageNode")
const CONTENT = [
    "/",
    "/properties",
    "/neighbourhoods",
    "/notes",
    "/about",
    "/contact",
    "/properties/:slug",
    "/notes/:slug",
    "/404",
]
for (const path of CONTENT) {
    const p = pages.find((x) => x.path === path)
    if (!p) continue
    const ps = await framer.agent.serialize({ id: p.id, depth: 2 }, {})
    for (const bp of ps.children || []) {
        for (const c of bp.children || []) {
            if (c.name !== "Nav") continue
            if (c.attributes?.maxWidth) {
                lines.push(`SET ${c.id} maxWidth="null";`)
                notes.push(`${path}|${bp.name}|Nav clear maxW`)
            }
            if (c.attributes?.width !== "100%" && c.attributes?.width !== "1fr") {
                lines.push(`SET ${c.id} width="100%";`)
                notes.push(`${path}|${bp.name}|Nav width→100%`)
            }
        }
    }
}

if (!lines.length) return { applied: 0, notes: ["noop"] }

const result = await framer.agent.applyChanges(lines.join("\n"), {})
return { applied: lines.length, notes, result: result?.message || result }

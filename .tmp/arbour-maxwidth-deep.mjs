/**
 * Deep dive: sections without maxWidth + all BP for Home Process/Stats/Contact/Notes manifesto
 * Also check page canvas widths and whether content stacks are centered.
 */
const TARGETS = [
    { path: "/", names: ["Process Section", "Arbour_StatsBand", "Hero Section", "Bottom"] },
    { path: "/notes", names: ["Journal Manifesto", "Journal"] },
    { path: "/contact", names: ["Contact Hero", "Contact Opening", "Private Consultation Pause"] },
    { path: "/about", names: ["Beat 2 — Cinematic Image", "Beat 1 — Portrait Stage"] },
    { path: "/notes/:slug", names: ["Journal Text Column", "Article Body Wrap", "More From Journal"] },
]

const pages = await framer.getNodesWithType("WebPageNode")
const deep = []

function snap(n, depth = 0) {
    if (!n || depth > 3) return null
    const a = n.attributes || {}
    const out = {
        id: n.id,
        name: n.name,
        width: a.width ?? null,
        maxWidth: a.maxWidth ?? null,
        minWidth: a.minWidth ?? null,
        height: a.height ?? null,
        pad: a.padding ?? null,
        layout: a.layout ?? null,
        align: a.stackAlignment ?? a.stackAlign ?? null,
        justify: a.stackDistribution ?? null,
        position: a.position ?? null,
        centerX: a.centerX ?? null,
        gap: a.gap ?? null,
    }
    if (depth < 2 && n.children?.length) {
        out.children = n.children.slice(0, 12).map((c) => snap(c, depth + 1))
    }
    return out
}

for (const t of TARGETS) {
    const p = pages.find((x) => x.path === t.path)
    if (!p) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 4 }, {})
    for (const bp of ser.children || []) {
        for (const c of bp.children || []) {
            if (!t.names.some((n) => (c.name || "").includes(n) || n.includes(c.name || "")))
                continue
            deep.push({
                path: t.path,
                bp: bp.name,
                node: snap(c, 0),
            })
        }
    }
}

// Also: for EVERY top section on Desktop across content pages — does it have
// maxWidth OR is it intentional full-bleed (pad L/R 0)?
const pages2 = await framer.getNodesWithType("WebPageNode")
const verdict = []
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
const SHELL = /Loading|Smooth|Atmosphere|Noise|Blur|Scroll|Nav|Footer|Cue/i

for (const path of CONTENT) {
    const p = pages2.find((x) => x.path === path)
    if (!p) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 2 }, {})
    for (const bp of ser.children || []) {
        for (const c of bp.children || []) {
            if (SHELL.test(c.name || "")) continue
            const a = c.attributes || {}
            const pad = String(a.padding || "")
            const parts = pad.match(/([\d.]+)px/g) || []
            // padding shorthand: 1=all, 2=V H, 3=T H B, 4=T R B L
            let lr = null
            if (parts.length === 1) lr = parseFloat(parts[0])
            else if (parts.length === 2) lr = parseFloat(parts[1])
            else if (parts.length === 3) lr = parseFloat(parts[1])
            else if (parts.length === 4) lr = parseFloat(parts[1]) // R; check L separately
            const lOnly =
                parts.length === 4 ? parseFloat(parts[3]) : lr
            const rOnly =
                parts.length === 4 ? parseFloat(parts[1]) : lr
            const fullBleedLR = (lOnly === 0 && rOnly === 0) || pad === "0px" || pad === "0"
            const hasMax = !!a.maxWidth
            const risk =
                !hasMax && !fullBleedLR && (a.width === "100%" || a.width === "1fr" || !a.width)
            verdict.push({
                path,
                bp: bp.name,
                name: c.name,
                maxWidth: a.maxWidth || null,
                width: a.width || null,
                pad,
                fullBleedLR: !!fullBleedLR,
                risk: !!risk,
            })
        }
    }
}

return {
    deep,
    riskSections: verdict.filter((v) => v.risk),
    allDesktopRisk: verdict.filter((v) => v.risk && v.bp === "Desktop"),
    safeNoMax: verdict.filter((v) => !v.maxWidth && !v.risk && v.bp === "Desktop"),
}

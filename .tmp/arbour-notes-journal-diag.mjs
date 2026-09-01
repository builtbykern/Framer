/**
 * Diagnose Notes + Home Journal layout: why content sits far right with empty left.
 * Compare left edges / maxWidth / pads of Journal shells vs Footer.
 */
const pages = await framer.getNodesWithType("WebPageNode")

function snap(n, depth = 0) {
    if (!n || depth > 3) return null
    const a = n.attributes || {}
    return {
        id: n.id,
        name: n.name,
        w: a.width ?? null,
        maxW: a.maxWidth ?? null,
        minW: a.minWidth ?? null,
        pad: a.padding ?? null,
        layout: a.layout ?? null,
        dir: a.stackDirection ?? null,
        align: a.stackAlignment ?? null,
        justify: a.stackDistribution ?? null,
        gap: a.gap ?? null,
        pos: a.position ?? null,
        left: a.left ?? null,
        right: a.right ?? null,
        centerX: a.centerX ?? null,
        children:
            depth < 3
                ? (n.children || []).slice(0, 14).map((c) => snap(c, depth + 1))
                : undefined,
    }
}

const out = {}
for (const path of ["/notes", "/", "/contact"]) {
    const p = pages.find((x) => x.path === path)
    if (!p) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 5 }, {})
    out[path] = {}
    for (const bp of ser.children || []) {
        if (bp.name !== "Desktop") continue
        const tops = (bp.children || []).map((c) => ({
            name: c.name,
            id: c.id,
            maxW: c.attributes?.maxWidth,
            w: c.attributes?.width,
            pad: c.attributes?.padding,
            align: c.attributes?.stackAlignment,
            justify: c.attributes?.stackDistribution,
            layout: c.attributes?.layout,
            dir: c.attributes?.stackDirection,
        }))
        out[path].tops = tops
        const journal = (bp.children || []).find((c) =>
            /Journal|Manifesto/i.test(c.name || ""),
        )
        const journals = (bp.children || []).filter((c) =>
            /Journal|Manifesto|Footer/i.test(c.name || ""),
        )
        out[path].deep = journals.map((j) => snap(j, 0))
    }
}

return out

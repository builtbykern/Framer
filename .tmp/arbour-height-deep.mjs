/**
 * Deep height audit: cards, images, media frames with fixed px heights.
 * Focus on nodes that stretch wide under 90% maxWidth.
 */
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

const pages = await framer.getNodesWithType("WebPageNode")
const comps = await framer.getNodesWithType("ComponentNode")

const heights = []
const maxWDist = {}

function walk(n, path, d = 0) {
    if (!n || d > 7) return
    const a = n.attributes || {}
    const mw = a.maxWidth
    if (mw) maxWDist[mw] = (maxWDist[mw] || 0) + 1

    const h = a.height
    if (h && /^\d+(\.\d+)?px$/.test(h)) {
        const nH = parseFloat(h)
        if (nH >= 100) {
            heights.push({
                path: `${path}/${n.name || "?"}`,
                id: n.id,
                h: nH,
                w: a.width ?? null,
                maxW: mw ?? null,
                aspect: a.aspectRatio ?? null,
                minH: a.minHeight ?? null,
                maxH: a.maxHeight ?? null,
                fill: !!(a.fill || a.backgroundImage || a.backgroundColor),
            })
        }
    }
    for (const c of n.children || []) walk(c, `${path}/${n.name || "?"}`, d + 1)
}

for (const path of CONTENT) {
    const p = pages.find((x) => x.path === path)
    if (!p) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 7 }, {})
    for (const bp of ser.children || []) {
        walk(bp, `${path}|${bp.name}`, 0)
    }
}

for (const name of ["Footer", "Nav", "TerritoryRail", "Arbour_StatsBand"]) {
    const c = comps.find((x) => x.name === name || (x.name || "").includes(name))
    if (!c) continue
    const ser = await framer.agent.serialize({ id: c.id, depth: 6 }, {})
    walk(ser, `Comp/${c.name}`, 0)
}

// Also list all component names for discovery
const compNames = (comps || []).map((c) => c.name)

heights.sort((a, b) => b.h - a.h)

// Group by rounded height
const byH = {}
for (const h of heights) {
    const k = h.h
    if (!byH[k]) byH[k] = []
    byH[k].push(h.path)
}

return {
    compNames,
    maxWDist,
    heightCount: heights.length,
    topHeights: heights.slice(0, 80),
    heightBuckets: Object.entries(byH)
        .map(([h, paths]) => ({ h: +h, count: paths.length, sample: paths.slice(0, 3) }))
        .sort((a, b) => b.h - a.h)
        .slice(0, 40),
}

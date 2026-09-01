/**
 * Get IDs + centering attrs for all risk sections; also Hero text column maxWidth.
 * Check how "good" sections center (Territories vs Process).
 */
const pages = await framer.getNodesWithType("WebPageNode")

const RISK = [
    ["/", "Process Section"],
    ["/", "Arbour_StatsBand"],
    ["/notes", "Journal Manifesto"],
    ["/contact", "Contact Hero"],
    ["/contact", "Contact Opening"],
    ["/notes/:slug", "Journal Text Column"],
    ["/properties/:slug", "Property Specs Band"],
    ["/properties/:slug", "Chapter Intro"],
    ["/notes/:slug", "Specs Strip"],
    ["/notes/:slug", "Closing Chapter"],
]

const GOOD = [
    ["/", "Territories Section"],
    ["/", "Recognition Section"],
    ["/about", "Beat 3 — Manifesto"],
]

function attrs(n) {
    const a = n.attributes || {}
    return {
        id: n.id,
        name: n.name,
        width: a.width,
        maxWidth: a.maxWidth,
        pad: a.padding,
        layout: a.layout,
        stackAlignment: a.stackAlignment,
        stackDistribution: a.stackDistribution,
        centerX: a.centerX,
        position: a.position,
        constraintsLocked: a.constraintsLocked,
    }
}

const out = { risk: [], good: [], heroText: [] }

for (const [path, name] of [...RISK, ...GOOD]) {
    const p = pages.find((x) => x.path === path)
    if (!p) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 3 }, {})
    for (const bp of ser.children || []) {
        for (const c of bp.children || []) {
            if (c.name !== name) continue
            const bucket = RISK.some((r) => r[0] === path && r[1] === name)
                ? "risk"
                : "good"
            const row = { path, bp: bp.name, ...attrs(c), children: [] }
            for (const d of (c.children || []).slice(0, 8)) {
                row.children.push({
                    ...attrs(d),
                    // one more for StatsBand / Process inner
                    kids: (d.children || []).slice(0, 4).map(attrs),
                })
            }
            out[bucket].push(row)
        }
    }
}

// Home hero text column
{
    const p = pages.find((x) => x.path === "/")
    const ser = await framer.agent.serialize({ id: p.id, depth: 4 }, {})
    for (const bp of ser.children || []) {
        const hero = (bp.children || []).find((c) => c.name === "Hero Section")
        if (!hero) continue
        const walk = (n, depth) => {
            if (!n || depth > 4) return
            if (/Text Content|Hero Copy|Headline/i.test(n.name || "")) {
                out.heroText.push({ bp: bp.name, ...attrs(n) })
            }
            for (const c of n.children || []) walk(c, depth + 1)
        }
        walk(hero, 0)
    }
}

return out

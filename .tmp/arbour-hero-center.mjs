/**
 * Inspect Hero layer positioning; center Text Content Column on ultrawide.
 * Prefer: if image/gradient are absolute, set Hero stackAlignment=center.
 * Else: set Text Content Column centerX / width 100% with maxWidth (Framer pattern).
 */
const pages = await framer.getNodesWithType("WebPageNode")
const p = pages.find((x) => x.path === "/")
const ser = await framer.agent.serialize({ id: p.id, depth: 4 }, {})

const heroes = []
for (const bp of ser.children || []) {
    const hero = (bp.children || []).find((c) => c.name === "Hero Section")
    if (!hero) continue
    const a = hero.attributes || {}
    heroes.push({
        bp: bp.name,
        id: hero.id,
        layout: a.layout,
        align: a.stackAlignment,
        justify: a.stackDistribution,
        gap: a.gap,
        children: (hero.children || []).map((c) => {
            const ca = c.attributes || {}
            return {
                id: c.id,
                name: c.name,
                position: ca.position,
                width: ca.width,
                height: ca.height,
                maxWidth: ca.maxWidth,
                top: ca.top,
                left: ca.left,
                right: ca.right,
                bottom: ca.bottom,
                centerX: ca.centerX,
                centerY: ca.centerY,
                pins: ca.pins,
            }
        }),
    })
}

// How does Territories center? page-level stack alignment
const homeBp = ser.children.find((b) => b.name === "Desktop")
const pageAlign = {
    layout: homeBp?.attributes?.layout,
    align: homeBp?.attributes?.stackAlignment,
    width: homeBp?.attributes?.width,
}

return { heroes, pageAlign }

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

function pick(n) {
    if (!n) return null
    const a = n.attributes || {}
    return {
        id: n.id,
        name: n.name,
        w: a.width,
        h: a.height,
        pos: a.position,
        top: a.top,
        left: a.left,
        overflow: a.overflow,
        layout: a.layout,
        stackDir: a.stackDirection,
        gap: a.gap,
        z: a.zIndex,
        kids: (n.children || []).map((c) => ({
            id: c.id,
            name: c.name,
            w: c.attributes?.width,
            h: c.attributes?.height,
            pos: c.attributes?.position,
            top: c.attributes?.top,
            overflow: c.attributes?.overflow,
            layout: c.attributes?.layout,
            z: c.attributes?.zIndex,
            kids: (c.children || []).slice(0, 8).map((g) => ({
                id: g.id,
                name: g.name,
                w: g.attributes?.width,
                h: g.attributes?.height,
                pos: g.attributes?.position,
                top: g.attributes?.top,
                overflow: g.attributes?.overflow,
            })),
        })),
    }
}

const nodes = await framer.agent.serializeNodes(
    { ids: ["WQLkyLRf1", "BjqrvIntT", "nyI5jW7lA"], depth: 3 },
    { pagePath: "/" }
)
console.log(JSON.stringify({ project: info.name, nodes: nodes.map(pick) }, null, 2))

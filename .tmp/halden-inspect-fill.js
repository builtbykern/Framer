const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const nodes = await framer.agent.serializeNodes(
    {
        ids: ["WQLkyLRf1", "BjqrvIntT", "nyI5jW7lA"],
        depth: 2,
    },
    { pagePath: "/" }
)
function walk(n) {
    if (!n) return null
    const a = n.attributes || {}
    return {
        id: n.id,
        name: n.name,
        w: a.width,
        h: a.height,
        pos: a.position,
        kids: (n.children || []).slice(0, 8).map(walk),
    }
}
console.log(JSON.stringify({ project: info.name, nodes: nodes.map(walk) }, null, 2))

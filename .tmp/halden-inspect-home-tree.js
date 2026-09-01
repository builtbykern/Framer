const tablet = await framer.agent.serializeNodes(
    { ids: ["BjqrvIntT"], depth: 2 },
    { pagePath: "/" }
)
const phone = await framer.agent.serializeNodes(
    { ids: ["nyI5jW7lA"], depth: 2 },
    { pagePath: "/" }
)
function walk(n, d = 0) {
    if (!n) return null
    const a = n.attributes || {}
    return {
        id: n.id,
        name: n.name,
        w: a.width,
        h: a.height,
        pos: a.position,
        kids: (n.children || []).slice(0, 12).map((c) => walk(c, d + 1)),
    }
}
console.log(JSON.stringify({ tablet: tablet.map(walk), phone: phone.map(walk) }, null, 2))

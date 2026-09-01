const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const meta = await framer.agent.getNode({ id: "YonVwWSco" }, { pagePath: "/" })
const line = await framer.agent.getNode({ id: "BZ3f5p82k" }, { pagePath: "/" })
const card = await framer.agent.getNode({ id: "gSGwySyKV" }, { pagePath: "/" })
function slim(n) {
    if (!n) return n
    const a = n.attributes || {}
    return {
        id: n.id,
        name: a.name || n.name,
        layout: a.layout,
        stackDirection: a.stackDirection,
        gap: a.gap,
        padding: a.padding,
        width: a.width,
        height: a.height,
        kids: (n.children || []).map((c) => c.id || c.attributes?.name),
    }
}
console.log(
    JSON.stringify(
        {
            project: info.name,
            card: slim(card),
            meta: slim(meta),
            line: slim(line),
        },
        null,
        2
    )
)

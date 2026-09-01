const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const ids = ["BjqrvIntT", "nyI5jW7lA", "BjqrvIntTRV7bjlgdh", "nyI5jW7lARV7bjlgdh", "WQLkyLRf1"]
const nodes = {}
for (const id of ids) {
    const n = await framer.agent.getNode({ id }, { pagePath: "/" })
    const a = n?.attributes || {}
    nodes[id] = {
        name: n?.name,
        type: n?.type,
        width: a.width,
        height: a.height,
        overflow: a.overflow,
        layout: a.layout,
    }
}
console.log(JSON.stringify({ project: info.name, nodes }, null, 2))

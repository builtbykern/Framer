const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)
const files = await framer.getCodeFiles()
const nodes = await framer.agent.serializeNodes(
    {
        ids: [
            "BjqrvIntT",
            "nyI5jW7lA",
            "BjqrvIntTRV7bjlgdh",
            "nyI5jW7lARV7bjlgdh",
        ],
        depth: 0,
    },
    { pagePath: "/" }
)
function slim(n) {
    if (!n) return null
    const a = n.attributes || {}
    return {
        id: n.id,
        name: n.name,
        width: a.width,
        height: a.height,
        top: a.top,
        bottom: a.bottom,
        view: a["$control__view"],
    }
}
console.log(
    JSON.stringify(
        {
            project: info.name,
            files: files.map((f) => f.name),
            nodes: nodes.map(slim),
        },
        null,
        2
    )
)

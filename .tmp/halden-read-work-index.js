const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)
const node = await framer.agent.getNode(
    { id: "afUswAq7g" },
    { pagePath: "/work/:Work" }
)
const ser = await framer.agent.serializeNodes(
    { ids: ["afUswAq7g"], depth: 1 },
    { pagePath: "/work/:Work" }
)
console.log(
    JSON.stringify(
        {
            project: info.name,
            controlKeys: Object.keys(node?.attributes || {}).filter((k) =>
                k.startsWith("$control")
            ),
            serIndex: ser?.[0]?.attributes?.$control__index,
            serKeys: Object.keys(ser?.[0]?.attributes || {}).filter((k) =>
                k.startsWith("$control")
            ),
        },
        null,
        2
    )
)

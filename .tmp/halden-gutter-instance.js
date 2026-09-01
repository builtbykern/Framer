const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)
const ser = await framer.agent.serializeNodes(
    { ids: ["H9TnltXVB", "RV7bjlgdh", "BjqrvIntTRV7bjlgdh"], depth: 1 },
    { pagePath: "/" }
)
console.log(
    JSON.stringify(
        ser.map((n) => ({
            id: n.id,
            name: n.name,
            gap: n.attributes?.gap,
            collection: n.attributes?.$control__collection,
            view: n.attributes?.$control__view,
        })),
        null,
        2
    )
)

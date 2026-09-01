const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const before = await framer.agent.serializeNodes(
    { ids: ["afUswAq7g"], depth: 0 },
    { pagePath: "/work/:Work" }
)

const applied = await framer.agent.applyChanges(
    'SET afUswAq7g $control__index="false";',
    { pagePath: "/work/:Work" }
)

const after = await framer.agent.serializeNodes(
    { ids: ["afUswAq7g"], depth: 0 },
    { pagePath: "/work/:Work" }
)

console.log(
    JSON.stringify(
        {
            project: info.name,
            beforeIndex: before?.[0]?.attributes?.$control__index,
            afterIndex: after?.[0]?.attributes?.$control__index,
            errors: applied.errors,
        },
        null,
        2
    )
)

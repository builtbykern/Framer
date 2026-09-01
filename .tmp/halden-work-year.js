const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const work = await framer.agent.serializeNodes(
    { ids: ["vsQhdBRSa", "gPAtEpWYL", "YYTXabA2d", "XSeOzvyqJ"], depth: 5 },
    { pagePath: "/work/:Work" }
)
console.log(JSON.stringify(work, null, 2).slice(0, 12000))

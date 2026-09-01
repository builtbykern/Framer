const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const ser = await framer.agent.serializeNodes(
    { ids: ["afUswAq7g", "yn0nMGJJL", "i_pl00Sun", "rT9WGdFVR"], depth: 2 },
    { pagePath: "/work/:Work" }
)

const phoneSer = await framer.agent.serializeNodes(
    { ids: ["Tf2mbU7Bvi_pl00Sun", "Tf2mbU7Bvyn0nMGJJL", "Tf2mbU7BvafUswAq7g"], depth: 2 },
    { pagePath: "/work/:Work" }
)

console.log(JSON.stringify({ project: info.name, ser, phoneSer }, null, 2))

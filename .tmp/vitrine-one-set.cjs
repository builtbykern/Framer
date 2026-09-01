const info = await framer.getProjectInfo()
if (info.name !== "Fair Platform") throw new Error(info.name)

const r = await framer.agent.applyChanges(
    'SET KVgGkkS4z textStylePreset="Body" textTransform="none";',
    { pagePath: "/" }
)

console.log(JSON.stringify(r, null, 2).slice(0, 8000))

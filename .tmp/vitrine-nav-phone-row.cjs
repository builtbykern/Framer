const info = await framer.getProjectInfo()
if (info.name !== "Fair Platform") throw new Error(info.name)

const phoneRow = await framer.agent.serializeNodes({
    ids: ["tKUMOkWpPyZes1fNVs", "Nx5jccWgMyZes1fNVs"],
    depth: 2,
    attributeFilter: ["id", "name", "width", "stackDistribution"],
})
console.log(JSON.stringify(phoneRow, null, 2))

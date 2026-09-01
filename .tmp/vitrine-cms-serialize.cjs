const info = await framer.getProjectInfo()
if (info.name !== "Fair Platform") throw new Error(info.name)

const col = await framer.agent.serializeNodes({
    ids: ["t2sbY17Aq"],
    depth: 2,
    attributeFilter: ["id", "name", "slug", "text", "draft"],
})

console.log(JSON.stringify(col, null, 2).slice(0, 12000))

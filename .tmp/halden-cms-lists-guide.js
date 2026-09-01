const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const guides = await framer.agent.readProject([
    { type: "implementation-guide-from-index", name: "CMS Collection Lists" },
    { type: "implementation-guide-from-index", name: "CMS Detail Pages" },
])

console.log(JSON.stringify(guides, null, 2).slice(0, 40000))

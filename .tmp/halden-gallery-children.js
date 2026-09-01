const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const pagePath = "/work/:Work"
const gallery = await framer.agent.serializeNodes(
    { ids: ["yn0nMGJJL"], depth: 2, attributeFilter: ["name", "fill"] },
    { pagePath }
)
console.log(JSON.stringify(gallery, null, 2).slice(0, 4000))

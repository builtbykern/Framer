const info = await framer.getProjectInfo()
if (info.name !== "Fair Platform") throw new Error(info.name)

const ids = ["tZytgw_pu", "lkZBIAg86", "RXZYU_SGB", "EDUlD2m19", "vWwUi2iXi", "X3kJRxUxX", "zyvPp0qI0", "N8rSuGdDW"]
const items = await framer.agent.serializeNodes({ ids, depth: 0, attributeFilter: ["id", "name", "path", "slug"] })
console.log(JSON.stringify(items, null, 2))

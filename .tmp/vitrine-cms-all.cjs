const info = await framer.getProjectInfo()
if (info.name !== "Fair Platform") throw new Error(info.name)

const ids = ["tZytgw_pu", "lkZBIAg86", "RXZYU_SGB", "EDUlD2m19", "vWwUi2iXi", "X3kJRxUxX", "zyvPp0qI0", "N8rSuGdDW"]
const items = await framer.agent.serializeNodes({ ids, depth: 0 })
const rows = items.map((it) => ({
    id: it.id,
    title: it.attributes?.$control__title,
    slug: it.attributes?.$control__slug,
    featured: it.attributes?.$control__featured,
    module: it.attributes?.$control__module,
}))
const blob = JSON.stringify(rows).toLowerCase()
const leftovers = ["glass hours", "halden", "lorem", "quarto", "shopify"].filter((n) => blob.includes(n))
console.log(JSON.stringify({ rows, leftovers }, null, 2))

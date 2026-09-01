const pagePath = "/properties"
const tree = await framer.agent.serialize({ id: "uBAGmujMa", depth: 10 }, { pagePath })
const lists = []
function walk(n) {
  if (!n) return
  const a = n.attributes || {}
  if (a.collectionList) {
    lists.push({
      id: n.id,
      name: n.name,
      mq: n.$mediaQuery?.name,
      collectionList: a.collectionList,
      kidTypes: (n.children || []).map((c) => ({ id: c.id, type: c.type, name: c.name, comp: c.attributes?.component })),
    })
  }
  for (const c of n.children || []) walk(c)
}
walk(tree)
console.log(JSON.stringify(lists, null, 2))

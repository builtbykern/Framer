const pagePath = "/properties"
const tree = await framer.agent.serialize({ id: "uBAGmujMa", depth: 12 }, { pagePath })
const hits = []
function walk(n, path) {
  if (!n) return
  const a = n.attributes || {}
  const comp = a.component || n.component || ""
  const name = n.name || ""
  if (/PropertyCard/i.test(name) || String(comp).includes("I2raC3I")) {
    hits.push({
      id: n.id,
      name,
      mq: n.$mediaQuery?.name,
      comp,
      controls: Object.fromEntries(
        Object.entries(a).filter(([k]) => k.startsWith("$control__"))
      ),
    })
  }
  for (const c of n.children || []) walk(c, path.concat(name || n.id))
}
walk(tree, [])
console.log(JSON.stringify({ count: hits.length, sample: hits.slice(0, 9) }, null, 2))

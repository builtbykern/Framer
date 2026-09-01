const pagePath = "/neighbourhoods"
const page = await framer.agent.serialize(
  { id: "dZfxmFpqB", depth: 6, attributeFilter: ["name", "visible", "width", "height"] },
  { pagePath }
)

const lists = []
const cards = []
function walk(n, path) {
  if (!n) return
  const name = n.name || ""
  if (/collection|list|checkerboard|territory card|hovermedia|photograph/i.test(name) || n.type?.includes("Collection")) {
    lists.push({
      id: n.id,
      type: n.type,
      name,
      mq: n.$mediaQuery?.name,
      path: path.slice(-4),
      kids: (n.children || []).length,
    })
  }
  if (name === "Territory Card" || n.id === "i56eWdACt" || /i56eWdACt/.test(n.id)) {
    cards.push({ id: n.id, type: n.type, name, mq: n.$mediaQuery?.name, path: path.slice(-4) })
  }
  for (const c of n.children || []) walk(c, path.concat(name || n.id))
}
walk(Array.isArray(page) ? page[0] : page, [])

// CMS items image presence
const cols = await framer.getCollections()
const nh = cols.find((c) => c.id === "U0QLvHg7O" || c.name === "Neighbourhoods")
const fields = await nh.getFields()
const byId = Object.fromEntries(fields.map((f) => [f.id, f]))
const items = await nh.getItems()
const itemImgs = items.map((item) => {
  const hero = item.fieldData?.["dM8yn13g7"]?.value
  const map = item.fieldData?.["ppzgDk7Mi"]?.value
  return {
    slug: item.slug,
    title: item.fieldData?.["tBUaKupCV"]?.value,
    hero: hero ? (typeof hero === "string" ? hero.slice(0, 60) : hero?.url || hero?.src || Object.keys(hero || {})) : null,
    map: map ? (typeof map === "string" ? map.slice(0, 60) : map?.url || map?.src || Object.keys(map || {})) : null,
    hasHero: !!hero,
    hasMap: !!map,
  }
})

// readComponentControls
let controls = null
try {
  controls = await framer.agent.readComponentControls({ componentIds: ["nMMl08t"] })
} catch (e) {
  controls = { error: String(e.message || e) }
}

console.log(
  JSON.stringify(
    {
      lists: lists.slice(0, 40),
      cards,
      itemImgs,
      controls,
    },
    null,
    2
  )
)

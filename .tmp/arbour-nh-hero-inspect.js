const pagePath = "/neighbourhoods"
const proj = await framer.getProjectInfo()
if (proj.name !== "Arbour") throw new Error(proj.name)

async function dump(id, depth = 2) {
  return framer.agent.serialize({ id, depth }, { pagePath })
}

const copy = await dump("I1ekolXeW", 3)
const h1 = await dump("n9ay7tOtM", 2)
const meta = await dump("mGNFNlJAN", 2)
const bottom = await dump("KgtJlnIFG", 3)
const hero = await dump("ycUqIc8V3", 2)

console.log(
  JSON.stringify(
    {
      heroAttrs: hero.attributes,
      copyAttrs: copy.attributes,
      copyKids: (copy.children || []).map((c) => ({
        id: c.id,
        name: c.name,
        type: c.type,
        attrs: c.attributes,
      })),
      metaAttrs: meta.attributes,
      h1Attrs: h1.attributes,
      bottomKids: (bottom.children || []).map((c) => ({
        id: c.id,
        name: c.name,
        type: c.type,
        attrs: c.attributes,
      })),
    },
    null,
    2
  )
)

const aboutPage = (await framer.getNodesWithType("WebPageNode")).find(
  (p) => p.path === "/about"
)
const about = await framer.agent.serialize(
  { id: aboutPage.id, depth: 5 },
  { pagePath: "/about" }
)
const desk = (about.children || []).find((c) => c.name === "Desktop")

function findNamed(n, re, out = []) {
  if (!n) return out
  if (re.test(n.name || "")) out.push(n)
  for (const c of n.children || []) findNamed(c, re, out)
  return out
}
const heroes = findNamed(desk, /Hero/i)
for (const n of heroes) {
  console.log(
    "ABOUT",
    JSON.stringify(
      {
        id: n.id,
        name: n.name,
        attrs: n.attributes,
        kids: (n.children || []).map((c) => ({
          id: c.id,
          name: c.name,
          type: c.type,
          h: c.attributes?.height,
          w: c.attributes?.width,
          fill: c.attributes?.fill,
          pad: c.attributes?.padding,
          gap: c.attributes?.gap,
          layout: c.attributes?.layout,
        })),
      },
      null,
      2
    )
  )
}

// Get a neighbourhood hero image URL for fragment
const cols = await framer.getCollections()
const nh = cols.find((c) => c.name === "Neighbourhoods")
const fields = await nh.getFields()
const items = await nh.getItems()
const byName = Object.fromEntries(fields.map((f) => [f.name, f]))
const heroField = byName["Hero"] || fields.find((f) => /hero/i.test(f.name))
const first = items[0]
const hv = first.fieldData[heroField.id]?.value
console.log(
  "NH image sample",
  first.slug,
  typeof hv === "object" ? hv.url : hv,
  "field",
  heroField.name
)

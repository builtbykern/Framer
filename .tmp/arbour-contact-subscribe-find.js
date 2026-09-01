const pagePath = "/contact"
const page = (await framer.getNodesWithType("WebPageNode")).find((p) => p.path === "/contact")
const root = await framer.agent.serialize({ id: page.id, depth: 10 }, { pagePath })
const hits = []
function walk(n, d = 0) {
  if (!n || d > 12) return
  const name = n.name || ""
  const disp = n.$componentDisplayName || ""
  const comp = n.component || ""
  const attrs = n.attributes || {}
  const label =
    attrs["$control__label"] ||
    attrs["$control__title"] ||
    attrs["$control__text"] ||
    ""
  const hay = `${name} ${disp} ${comp} ${label}`
  if (/subscribe|FormButton|PrimaryButton|newsletter|Submit/i.test(hay)) {
    const controls = {}
    for (const [k, v] of Object.entries(attrs)) {
      if (k.startsWith("$control")) controls[k] = v
    }
    hits.push({ id: n.id, name, type: n.type, disp, comp, label, controls })
  }
  // also rich text containing Subscribe
  const textish = JSON.stringify(attrs).slice(0, 400)
  if (/Subscribe/i.test(textish) && !hits.find((h) => h.id === n.id)) {
    hits.push({ id: n.id, name, type: n.type, disp, snippet: textish.slice(0, 200) })
  }
  for (const c of n.children || []) walk(c, d + 1)
}
walk(root)
console.log(JSON.stringify(hits, null, 2))

// parent of newsletter
const news = await framer.agent.serialize({ id: "bhQOxL_ST", depth: 0 }, { pagePath })
const parentId = news.$parentId
const parent = await framer.agent.serialize({ id: parentId, depth: 4 }, { pagePath })
console.log(
  "NEWS PARENT",
  parentId,
  parent.name,
  JSON.stringify(
    (parent.children || []).map((c) => ({
      id: c.id,
      name: c.name,
      type: c.type,
      disp: c.$componentDisplayName,
      comp: c.component,
      controls: Object.fromEntries(
        Object.entries(c.attributes || {}).filter(([k]) => k.startsWith("$control"))
      ),
    })),
    null,
    2
  )
)

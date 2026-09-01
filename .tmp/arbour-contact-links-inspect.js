const pagePath = "/contact"
const page = (await framer.getNodesWithType("WebPageNode")).find((p) => p.path === "/contact")
console.log("page", page?.id)

// Walk for write privately / subscribe / button / underline
const root = await framer.agent.serialize({ id: page.id, depth: 8 }, { pagePath })
const hits = []
function walk(n, depth = 0) {
  if (!n || depth > 10) return
  const name = n.name || ""
  const type = n.type || ""
  const attrs = n.attributes || {}
  const blob = JSON.stringify(attrs).slice(0, 500)
  if (
    /write privately|subscribe|underline|formbutton|primarybutton|newsletter|enquiry/i.test(
      name + " " + blob
    )
  ) {
    hits.push({
      id: n.id,
      name,
      type,
      componentIdentifier: attrs.componentIdentifier || attrs.componentId,
      controls: attrs.controls || null,
      link: attrs.link || attrs.url || null,
      textColor: attrs.textColor,
      opacity: attrs.opacity,
    })
  }
  for (const c of n.children || []) walk(c, depth + 1)
}
walk(root)
console.log(JSON.stringify(hits, null, 2))

// Also dump Direct Enquiry
const enq = await framer.agent.serialize({ id: "uONXSHosa", depth: 3 }, { pagePath })
console.log(
  "ENQUIRY",
  JSON.stringify(
    enq,
    (k, v) => (typeof v === "string" && v.length > 200 ? v.slice(0, 200) : v),
    2
  ).slice(0, 8000)
)

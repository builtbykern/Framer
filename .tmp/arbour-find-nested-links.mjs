/* Find nested link pairs on Home, /properties-2, /contact */
const targets = {
  "/": "augiA20Il",
  "/properties-2": "uBAGmujMa",
  "/contact": "c7qpzB7hR",
}

function getHref(attrs) {
  if (!attrs) return null
  const h =
    attrs.href ??
    attrs.link ??
    attrs.url ??
    attrs["data-framer-page-link"] ??
    null
  if (h == null || h === "" || h === false) return null
  if (typeof h === "object") return JSON.stringify(h).slice(0, 120)
  return String(h)
}

function hasLink(n) {
  const attrs = n.attributes || {}
  const href = getHref(attrs)
  if (href) return href
  // Framer sometimes stores link as nested
  if (attrs.link && typeof attrs.link === "object") {
    return JSON.stringify(attrs.link).slice(0, 120)
  }
  return null
}

const nested = []

function walk(n, pagePath, linkAncestors) {
  if (!n) return
  const href = hasLink(n)
  const nextAncestors = [...linkAncestors]
  if (href) {
    if (linkAncestors.length) {
      nested.push({
        pagePath,
        outer: linkAncestors[linkAncestors.length - 1],
        inner: {
          id: n.id,
          name: n.name,
          type: n.type,
          href,
        },
      })
    }
    nextAncestors.push({
      id: n.id,
      name: n.name,
      type: n.type,
      href,
    })
  }
  for (const c of n.children || []) walk(c, pagePath, nextAncestors)
}

const out = []
for (const [pagePath, id] of Object.entries(targets)) {
  const tree = await framer.agent.serialize(
    {
      id,
      depth: 20,
      attributeFilter: [
        "name",
        "href",
        "link",
        "url",
        "text",
        "component",
        "componentIdentifier",
      ],
    },
    { pagePath }
  )
  const root = Array.isArray(tree) ? tree[0] : tree
  const before = nested.length
  walk(root, pagePath, [])
  out.push({
    pagePath,
    nestedCount: nested.length - before,
  })
}

console.log(JSON.stringify({ summary: out, nested }, null, 2))

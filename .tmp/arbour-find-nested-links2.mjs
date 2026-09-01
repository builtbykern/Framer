/* Nested link finder — Framer stores link as attributes.link object */
const targets = {
  "/": "augiA20Il",
  "/properties-2": "uBAGmujMa",
  "/contact": "c7qpzB7hR",
}

function linkInfo(n) {
  const a = n.attributes || {}
  if (a.link != null && a.link !== false && a.link !== "") {
    if (typeof a.link === "object") {
      return {
        href: a.link.href ?? a.link.url ?? JSON.stringify(a.link).slice(0, 100),
        raw: a.link,
      }
    }
    return { href: String(a.link), raw: a.link }
  }
  if (typeof a.href === "string" && a.href) return { href: a.href, raw: a.href }
  return null
}

const nested = []
const allLinks = []

function walk(n, pagePath, ancestors) {
  if (!n) return
  const info = linkInfo(n)
  const next = [...ancestors]
  if (info) {
    allLinks.push({
      pagePath,
      id: n.id,
      name: n.name,
      type: n.type,
      href: info.href,
      depth: ancestors.length,
      ancestorLinks: ancestors.filter((x) => x.link).map((x) => ({
        id: x.id,
        name: x.name,
        href: x.link.href,
      })),
    })
    if (ancestors.some((x) => x.link)) {
      const outer = [...ancestors].reverse().find((x) => x.link)
      nested.push({
        pagePath,
        outer: {
          id: outer.id,
          name: outer.name,
          type: outer.type,
          href: outer.link.href,
        },
        inner: {
          id: n.id,
          name: n.name,
          type: n.type,
          href: info.href,
        },
      })
    }
    next.push({
      id: n.id,
      name: n.name,
      type: n.type,
      link: info,
    })
  } else {
    next.push({ id: n.id, name: n.name, type: n.type, link: null })
  }
  for (const c of n.children || []) walk(c, pagePath, next)
}

for (const [pagePath, id] of Object.entries(targets)) {
  const tree = await framer.agent.serialize(
    {
      id,
      depth: 25,
      attributeFilter: ["name", "href", "link", "text", "component", "componentIdentifier"],
    },
    { pagePath }
  )
  walk(Array.isArray(tree) ? tree[0] : tree, pagePath, [])
}

// Also dump links whose text/name looks like VIEW / EXPLORE / WRITE / Underline
const interesting = allLinks.filter((l) =>
  /view|explore|write|territor|enquir|properties-2|neighbourhood|mailto|underline|primary|form/i.test(
    `${l.name} ${l.href}`
  )
)

console.log(
  JSON.stringify(
    {
      nestedCount: nested.length,
      nested,
      interesting: interesting.slice(0, 60),
      linkTotals: {
        "/": allLinks.filter((l) => l.pagePath === "/").length,
        "/properties-2": allLinks.filter((l) => l.pagePath === "/properties-2")
          .length,
        "/contact": allLinks.filter((l) => l.pagePath === "/contact").length,
      },
    },
    null,
    2
  )
)

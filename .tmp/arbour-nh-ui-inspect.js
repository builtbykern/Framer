/**
 * Serialize Neighbourhoods territories list + Territory Card template for improve-ui.
 */
const page = (await framer.getNodesWithType("WebPageNode")).find((p) => p.path === "/neighbourhoods")
const tree = await framer.agent.serialize({ id: page.id, depth: 16 }, {})

const sections = []
function walk(n, trail = []) {
  if (!n || typeof n !== "object") return
  const name = n.name || ""
  if (/territor|card|list|grid|collection|neighbour/i.test(name) || n.id === "i56eWdACt") {
    const a = n.attributes || {}
    sections.push({
      id: n.id,
      name,
      type: n.type,
      trail: trail.slice(-6),
      layout: a.layout,
      gap: a.gap,
      padding: a.padding,
      width: a.width,
      height: a.height,
      backgroundColor: a.backgroundColor,
      link: a.link?.href,
      cursor: a.cursor,
      textColor: a.textColor,
      font: a.font,
      fontSize: a.fontSize,
      opacity: a.opacity,
      borderRadius: a.borderRadius,
      overflow: a.overflow,
      component: n.component,
      childCount: (n.children || []).length,
      childNames: (n.children || []).map((c) => c.name || c.type).slice(0, 12),
    })
  }
  for (const c of n.children || []) walk(c, [...trail, name || n.id])
  for (const b of n.$breakpoints || []) walk(b, [...trail, "BP"])
}
walk(tree)

// Deep dump Territory Card
const card = await framer.agent.serialize({ id: "i56eWdACt", depth: 8 }, {})
function slim(n, d = 0) {
  if (!n || d > 6) return null
  const a = n.attributes || {}
  return {
    id: n.id,
    name: n.name,
    type: n.type,
    href: a.link?.href,
    bg: a.backgroundColor,
    color: a.textColor,
    fontSize: a.fontSize,
    font: a.font?.family || a.font,
    padding: a.padding,
    gap: a.gap,
    layout: a.layout,
    width: a.width,
    height: a.height,
    radius: a.borderRadius,
    opacity: a.opacity,
    image: a.backgroundImage ? "yes" : undefined,
    text: typeof a.text === "string" ? a.text.slice(0, 60) : undefined,
    children: (n.children || []).map((c) => slim(c, d + 1)).filter(Boolean),
  }
}

// Compare Home TerritoryRail instance controls if useful
let homeRail = null
try {
  const h = await framer.agent.serialize({ id: "AV7lJ46Wl", depth: 1 }, {})
  homeRail = {
    id: h.id,
    name: h.name,
    component: h.component,
    controls: Object.fromEntries(
      Object.entries(h.attributes || {}).filter(([k]) => k.startsWith("$control"))
    ),
  }
} catch (e) {
  homeRail = { error: String(e.message || e) }
}

console.log(
  JSON.stringify(
    {
      pageMeta: {
        title: tree.attributes?.metadata?.title,
        path: page.path,
      },
      sections: sections.slice(0, 50),
      card: slim(card),
      homeRail,
    },
    null,
    2
  )
)

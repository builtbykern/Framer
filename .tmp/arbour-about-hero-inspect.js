const pagePath = "/about"
const proj = await framer.getProjectInfo()
if (proj.name !== "Arbour") throw new Error("wrong " + proj.name)

const page = (await framer.getNodesWithType("WebPageNode")).find((p) => p.path === pagePath)
const root = await framer.agent.serialize({ id: page.id, depth: 6 }, { pagePath })

function brief(n, depth = 0) {
  if (!n || depth > 5) return null
  const a = n.attributes || {}
  const kids = (n.children || []).map((c) => brief(c, depth + 1)).filter(Boolean)
  return {
    id: n.id,
    name: n.name,
    type: n.type,
    disp: n.$componentDisplayName,
    mq: n.$mediaQuery?.name,
    w: a.width,
    h: a.height,
    layout: a.layout,
    dir: a.stackDirection,
    gap: a.gap,
    pad: a.padding,
    bg: a.backgroundColor || a.fill,
    pos: a.position,
    text: n.type === "TextNode" ? (a.text || a.styledText || "").toString().slice(0, 80) : undefined,
    textStyle: a.textStyle,
    visible: a.visible,
    children: kids.length ? kids : undefined,
  }
}

// Top-level sections
const sections = (root.children || []).map((c) => ({
  id: c.id,
  name: c.name,
  type: c.type,
  disp: c.$componentDisplayName,
  h: c.attributes?.height,
  bg: c.attributes?.backgroundColor || c.attributes?.fill,
  layout: c.attributes?.layout,
  kids: (c.children || []).length,
}))
console.log("SECTIONS", JSON.stringify(sections, null, 2))

// Find hero-like first content section (skip nav)
const content = (root.children || []).find(
  (c) => /hero|opener|intro|about/i.test(c.name || "") || c.attributes?.height
)
// dump first 3 non-nav frames
let count = 0
for (const c of root.children || []) {
  const n = (c.name || "").toLowerCase()
  if (/nav|menu|cursor|overlay/i.test(n)) continue
  console.log("\n=== BLOCK", ++count, c.name, c.id, "===")
  console.log(JSON.stringify(brief(c), null, 2).slice(0, 8000))
  if (count >= 3) break
}

const page = (await framer.getNodesWithType("WebPageNode")).find((p) => p.path === "/neighbourhoods")
const tree = await framer.agent.serialize({ id: page.id, depth: 18 }, {})
const media = []
function walk(n, trail = []) {
  if (!n) return
  if (/TerritoryHoverMedia/i.test(n.name || "") || String(n.component || "").includes("nMMl08t")) {
    media.push({ id: n.id, name: n.name, parentTrail: trail.slice(-3), component: n.component, image: n.attributes?.["$control__image"], imageB: n.attributes?.["$control__imageB"] })
  }
  for (const c of n.children || []) walk(c, [...trail, n.name || n.id])
  for (const b of n.$breakpoints || []) walk(b, [...trail, "BP"])
}
walk(tree)
const photo = await framer.agent.serialize({ id: "hX5NduSNi", depth: 3 }, {})
const card = await framer.agent.serialize({ id: "i56eWdACt", depth: 2 }, {})
console.log(JSON.stringify({
  media,
  photo: { h: photo.attributes?.height, fill: photo.attributes?.fill, kids: (photo.children||[]).map(c=>c.id+":"+c.name) },
  card: { border: card.attributes?.border, order: (card.children||[]).map(c=>c.name), dossierBorder: (card.children||[]).find(c=>c.name==="Territory Dossier")?.attributes?.border },
}, null, 2))

const card = await framer.agent.serialize({ id: "i56eWdACt", depth: 4 }, {})
const dossier = await framer.agent.serialize({ id: "QAa2V2fag", depth: 3 }, {})
const photo = await framer.agent.serialize({ id: "hX5NduSNi", depth: 2 }, {})

function summarize(node, depth = 0) {
  if (!node) return null
  const a = node.attributes || {}
  const kids = (node.children || []).map((c) => summarize(c, depth + 1))
  return {
    id: node.id,
    name: node.name || a.name,
    type: node.type,
    pad: a.padding,
    gap: a.gap,
    h: a.height,
    layout: a.layout,
    children: kids.length ? kids : undefined,
  }
}

console.log(JSON.stringify({ card: summarize(card), dossier: summarize(dossier), photo: summarize(photo) }, null, 2))

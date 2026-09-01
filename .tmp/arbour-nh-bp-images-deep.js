const pagePath = "/neighbourhoods"
const card = await framer.agent.serialize({ id: "i56eWdACt", depth: 8 }, { pagePath })

const imageish = []
function walk(n, bp, path) {
  if (!n) return
  const a = n.attributes || {}
  const name = n.name || ""
  const blob = JSON.stringify(a)
  const isImageish =
    n.type === "ImageNode" ||
    n.type === "ComponentInstanceNode" ||
    /image|photo|media|map|hero/i.test(name) ||
    /\$control__image|backgroundImage|image/i.test(blob)

  if (isImageish) {
    const controls = Object.fromEntries(
      Object.entries(a).filter(
        ([k]) =>
          k.startsWith("$control__") ||
          k === "backgroundImage" ||
          k === "image" ||
          k === "src" ||
          k === "visible"
      )
    )
    imageish.push({
      bp,
      id: n.id,
      type: n.type,
      name,
      path: path.slice(-5),
      controls,
      position: a.position,
      w: a.width,
      h: a.height,
    })
  }
  for (const c of n.children || []) walk(c, bp, path.concat(name || n.id))
}

walk(card, "D", [])

// Explicitly serialize T/P card replicas if they exist as separate roots
for (const [bp, id] of [
  ["T", "aJLpuUP0qi56eWdACt"],
  ["P", "Qonafp_oDi56eWdACt"],
]) {
  try {
    const n = await framer.agent.serialize({ id, depth: 8 }, { pagePath })
    walk(n, bp, [])
  } catch (e) {
    imageish.push({ bp, id, error: String(e.message || e) })
  }
}

// Also check CMS variables referenced
const varIds = ["dM8yn13g7", "ppzgDk7Mi"]
let vars = {}
try {
  // Try to resolve via agent or collection fields
  const cols = await framer.getCollections()
  const nh = cols.find((c) => /neighbour/i.test(c.name) || c.id === "U0QLvHg7O")
  if (nh) {
    const fields = await nh.getFields()
    vars.fields = fields.map((f) => ({
      id: f.id,
      name: f.name,
      type: f.type,
    }))
  }
} catch (e) {
  vars.error = String(e.message || e)
}

console.log(JSON.stringify({ imageishCount: imageish.length, imageish, vars }, null, 2))

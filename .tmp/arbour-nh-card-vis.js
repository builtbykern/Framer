const ids = ["Xb7Sjgfsi", "jMokcCFea", "sJB1mG6E1", "rIIdBjqU_", "QAa2V2fag", "v61cPV2xF"]
const out = {}
for (const id of ids) {
  const n = await framer.agent.serialize({ id, depth: 1 }, {})
  const a = n.attributes || {}
  out[id] = {
    name: n.name,
    visible: a.visible,
    opacity: a.opacity,
    height: a.height,
    display: a.display,
    pad: a.padding,
    text: typeof a.text === "string" ? a.text.slice(0, 80) : undefined,
  }
}
console.log(JSON.stringify(out, null, 2))

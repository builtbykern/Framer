const ids = [
  "Ltp8ot_zm",
  "buF4jg6C9",
  "rie14TaT9",
  "d9SNjsdke",
  "v61cPV2xF",
  "sJB1mG6E1",
  "rIIdBjqU_",
  "QAa2V2fag",
  "z2kRrpzAZ",
  "i56eWdACt",
]
const out = {}
for (const id of ids) {
  try {
    const n = await framer.agent.serialize({ id, depth: 2 }, { pagePath: "/neighbourhoods" })
    const a = n.attributes || {}
    out[id] = {
      name: n.name,
      type: n.type,
      visible: a.visible,
      pad: a.padding,
      gap: a.gap,
      layout: a.layout,
      stackDirection: a.stackDirection,
      stackDistribution: a.stackDistribution,
      stackAlignment: a.stackAlignment,
      h: a.height,
      w: a.width,
      textTruncation: a.textTruncation,
      text: typeof a.text === "string" ? a.text.slice(0, 60) : a.text,
      font: a.font,
      textColor: a.textColor,
      showView: a.$control__showView,
      children: (n.children || []).map((c) => ({
        id: c.id,
        name: c.name,
        type: c.type,
        visible: c.attributes?.visible,
        text: typeof c.attributes?.text === "string" ? String(c.attributes.text).slice(0, 40) : undefined,
        trunc: c.attributes?.textTruncation,
      })),
    }
  } catch (e) {
    out[id] = { error: String(e.message || e) }
  }
}
console.log(JSON.stringify(out, null, 2))

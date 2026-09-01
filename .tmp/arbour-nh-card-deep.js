/**
 * Deep dump Territory Card for redesign — all key layout/type attrs + BP replicas.
 */
const CARD = "i56eWdACt"
async function deep(id, depth = 5) {
  const n = await framer.agent.serialize({ id, depth }, {})
  function slim(x, d = 0) {
    if (!x || d > depth) return null
    const a = x.attributes || {}
    return {
      id: x.id,
      name: x.name,
      type: x.type,
      visible: a.visible,
      layout: a.layout,
      stackDirection: a.stackDirection,
      stackDistribution: a.stackDistribution,
      stackAlignment: a.stackAlignment,
      gap: a.gap,
      padding: a.padding,
      width: a.width,
      height: a.height,
      maxWidth: a.maxWidth,
      minHeight: a.minHeight,
      flex: a.flex,
      backgroundColor: a.backgroundColor,
      border: a.border,
      borderRadius: a.borderRadius,
      overflow: a.overflow,
      opacity: a.opacity,
      fontSize: a.fontSize,
      textColor: a.textColor,
      textStylePreset: a.textStylePreset,
      textTruncation: a.textTruncation,
      textAlignment: a.textAlignment,
      text: typeof a.text === "string" ? a.text.slice(0, 60) : undefined,
      href: a.link?.href,
      image: a.backgroundImage ? "bound-or-set" : undefined,
      children: (x.children || []).map((c) => slim(c, d + 1)).filter(Boolean),
    }
  }
  return slim(n)
}

const out = {
  desktop: await deep(CARD, 6),
  tablet: await deep("aJLpuUP0qi56eWdACt", 5),
  phone: await deep("Qonafp_oDi56eWdACt", 5),
  grid: await deep("km7dUqZI9", 2),
  panel: await deep("q3QLrEX8k", 2),
}
console.log(JSON.stringify(out, null, 2))

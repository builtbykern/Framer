const photo = await framer.agent.serialize({ id: "hX5NduSNi", depth: 2 }, {})
const dossier = await framer.agent.serialize({ id: "QAa2V2fag", depth: 2 }, {})
const card = await framer.agent.serialize({ id: "i56eWdACt", depth: 2 }, {})
const file = (await framer.getCodeFiles()).find((f) => f.name === "Arbour_TerritoryHoverMedia.tsx")
const content = file?.content || ""

// Compare PropertyCard hover/CTA patterns if available
const propCard = (await framer.getCodeFiles()).find((f) => f.name === "Arbour_PropertyCard.tsx")

function attrs(n) {
  const a = n?.attributes || {}
  return {
    id: n?.id,
    name: n?.name,
    h: a.height,
    pad: a.padding,
    gap: a.gap,
    bg: a.backgroundColor,
    border: a.border,
  }
}

console.log(
  JSON.stringify(
    {
      card: attrs(card),
      photo: attrs(photo),
      dossier: attrs(dossier),
      inst: photo?.children?.[0]?.attributes,
      cueInCode: content.includes("arbour-thm__cue"),
      overlayGone: !content.includes("arbour-thm__view"),
      cuePad: (content.match(/padding:\s*[^;]+/) || [])[0],
      propCardHasView: (propCard?.content || "").includes("VIEW"),
      propCardSnippet: (propCard?.content || "").slice(0, 0),
    },
    null,
    2
  )
)

// Pull PropertyCard CTA-ish patterns
if (propCard?.content) {
  const c = propCard.content
  const hits = []
  for (const re of [/VIEW|arrow|→|hover|Space Mono|letterSpacing/gi]) {
    let m
    const r = new RegExp(re.source, re.flags)
    while ((m = r.exec(c)) && hits.length < 20) {
      hits.push({ at: m.index, s: c.slice(Math.max(0, m.index - 40), m.index + 60).replace(/\s+/g, " ") })
    }
  }
  console.log("---PROP---")
  console.log(JSON.stringify(hits.slice(0, 12), null, 2))
}

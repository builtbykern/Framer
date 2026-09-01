const pagePath = "/neighbourhoods"
const COMP = "codeFile/nMMl08t:default"
const HERO = "var(--variable-dM8yn13g7)"
const MAP = "var(--variable-ppzgDk7Mi)"

// Add HoverMedia as DIRECT child of Territory Card (PropertyCard nesting depth)
const dsl1 = [
  `+ComponentInstanceNode nhMedia parent="i56eWdACt" component="${COMP}"`,
].join(";\n")
const res1 = await framer.agent.applyChanges(dsl1, { pagePath })

const dsl2 = [
  `SET nhMedia name="Arbour_TerritoryHoverMedia" position="relative" width="1fr" height="380px" $control__image="${HERO}" $control__imageB="${MAP}" $control__showView="false" $control__interval="900" $control__zoom="1.04"`,
  // Hide old photograph stack (and nested broken instances)
  `SET hX5NduSNi visible="false" height="0px" minHeight="0px" maxHeight="0px"`,
  `SET aJLpuUP0qhX5NduSNi visible="false" height="0px" minHeight="0px" maxHeight="0px"`,
  `SET Qonafp_oDhX5NduSNi visible="false" height="0px" minHeight="0px" maxHeight="0px"`,
  // BP height for new media (compound id unknown until we read it — set after)
].join(";\n")
const res2 = await framer.agent.applyChanges(dsl2, { pagePath })

const card = await framer.agent.serialize({ id: "i56eWdACt", depth: 2 }, { pagePath })
const cardT = await framer.agent.serialize({ id: "aJLpuUP0qi56eWdACt", depth: 2 }, { pagePath })
const cardP = await framer.agent.serialize({ id: "Qonafp_oDi56eWdACt", depth: 2 }, { pagePath })

function kids(c) {
  return (c.children || []).map((k) => ({
    id: k.id,
    name: k.name,
    type: k.type,
    visible: k.attributes?.visible,
    h: k.attributes?.height,
    image: k.attributes?.$control__image,
  }))
}

console.log(
  JSON.stringify(
    {
      res1: { message: res1?.message, errors: res1?.errors },
      res2: { message: res2?.message, errors: res2?.errors },
      kidsD: kids(card),
      kidsT: kids(cardT),
      kidsP: kids(cardP),
    },
    null,
    2
  )
)

const pagePath = "/neighbourhoods"
const COMP = "codeFile/nMMl08t:default"
const HERO = "var(--variable-dM8yn13g7)"
const MAP = "var(--variable-ppzgDk7Mi)"

// Recreate HoverMedia on Tablet + Phone photo frames
const dsl = [
  `DELETE aJLpuUP0qz2kRrpzAZ`,
  `DELETE Qonafp_oDz2kRrpzAZ`,
  `+ComponentInstanceNode mediaT parent="aJLpuUP0qhX5NduSNi" component="${COMP}"`,
  `+ComponentInstanceNode mediaP parent="Qonafp_oDhX5NduSNi" component="${COMP}"`,
].join(";\n")

const res1 = await framer.agent.applyChanges(dsl, { pagePath })

// Follow-up SET (DSL often needs SET after +ComponentInstanceNode)
const dsl2 = [
  `SET mediaT name="Arbour_TerritoryHoverMedia" position="absolute" left="0px" top="0px" width="100%" height="100%" centerAnchorX="0%" centerAnchorY="0%" $control__image="${HERO}" $control__imageB="${MAP}" $control__showView="false" $control__interval="900" $control__zoom="1.04" $control__viewLabel="VIEW →" $control__accent="var(--token-db86917b-d19e-4fd7-8dc5-e260f1f35cb1)"`,
  `SET mediaP name="Arbour_TerritoryHoverMedia" position="absolute" left="0px" top="0px" width="100%" height="100%" centerAnchorX="0%" centerAnchorY="0%" $control__image="${HERO}" $control__imageB="${MAP}" $control__showView="false" $control__interval="900" $control__zoom="1.04" $control__viewLabel="VIEW →" $control__accent="var(--token-db86917b-d19e-4fd7-8dc5-e260f1f35cb1)"`,
  // Keep Desktop bound
  `SET z2kRrpzAZ $control__image="${HERO}" $control__imageB="${MAP}" $control__showView="false"`,
  // Ensure collection list templates
  `SET aJLpuUP0qkm7dUqZI9 collectionList.collection="Neighbourhoods" collectionList.repeatedDescendantId="aJLpuUP0qi56eWdACt"`,
  `SET Qonafp_oDkm7dUqZI9 collectionList.collection="Neighbourhoods" collectionList.repeatedDescendantId="Qonafp_oDi56eWdACt"`,
].join(";\n")

const res2 = await framer.agent.applyChanges(dsl2, { pagePath })

const photoT = await framer.agent.serialize({ id: "aJLpuUP0qhX5NduSNi", depth: 2 }, { pagePath })
const photoP = await framer.agent.serialize({ id: "Qonafp_oDhX5NduSNi", depth: 2 }, { pagePath })

function mediaKid(photo) {
  const kid = (photo.children || [])[0]
  if (!kid) return null
  return {
    id: kid.id,
    type: kid.type,
    name: kid.name,
    image: kid.attributes?.$control__image,
    imageB: kid.attributes?.$control__imageB,
    w: kid.attributes?.width,
    h: kid.attributes?.height,
    position: kid.attributes?.position,
  }
}

console.log(
  JSON.stringify(
    {
      res1: { message: res1?.message, errors: res1?.errors },
      res2: { message: res2?.message, errors: res2?.errors },
      mediaT: mediaKid(photoT),
      mediaP: mediaKid(photoP),
    },
    null,
    2
  )
)

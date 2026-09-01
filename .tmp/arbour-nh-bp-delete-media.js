const pagePath = "/neighbourhoods"
const HERO = "var(--variable-dM8yn13g7)"

// Remove HoverMedia from T/P entirely — frame fill carries Hero
const dsl1 = [
  `DELETE aJLpuUP0qz2kRrpzAZ`,
  `DELETE Qonafp_oDz2kRrpzAZ`,
].join(";\n")
const res1 = await framer.agent.applyChanges(dsl1, { pagePath })

const dsl2 = [
  `SET aJLpuUP0qhX5NduSNi fill="${HERO}" fillImagePositionX="center" fillImagePositionY="center" overflow="clip" height="300px" minHeight="300px" maxHeight="300px"`,
  `SET Qonafp_oDhX5NduSNi fill="${HERO}" fillImagePositionX="center" fillImagePositionY="center" overflow="clip" height="300px" minHeight="300px" maxHeight="300px"`,
  `SET hX5NduSNi fill="null" height="380px"`,
  `SET z2kRrpzAZ visible="true" $control__image="${HERO}" $control__imageB="var(--variable-ppzgDk7Mi)" $control__showView="false"`,
  `SET aJLpuUP0qkm7dUqZI9 collectionList.collection="Neighbourhoods" collectionList.repeatedDescendantId="aJLpuUP0qi56eWdACt"`,
  `SET Qonafp_oDkm7dUqZI9 collectionList.collection="Neighbourhoods" collectionList.repeatedDescendantId="Qonafp_oDi56eWdACt"`,
].join(";\n")
const res2 = await framer.agent.applyChanges(dsl2, { pagePath })

const photoT = await framer.agent.serialize({ id: "aJLpuUP0qhX5NduSNi", depth: 2 }, { pagePath })
const photoP = await framer.agent.serialize({ id: "Qonafp_oDhX5NduSNi", depth: 2 }, { pagePath })

console.log(
  JSON.stringify(
    {
      res1: { message: res1?.message, errors: res1?.errors },
      res2: { message: res2?.message, errors: res2?.errors },
      kidsT: (photoT.children || []).map((c) => ({ id: c.id, type: c.type, name: c.name })),
      kidsP: (photoP.children || []).map((c) => ({ id: c.id, type: c.type, name: c.name })),
      fillT: photoT.attributes?.fill,
      fillP: photoP.attributes?.fill,
    },
    null,
    2
  )
)

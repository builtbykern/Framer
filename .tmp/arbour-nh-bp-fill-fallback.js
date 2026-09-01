const pagePath = "/neighbourhoods"
const HERO = "var(--variable-dM8yn13g7)"

const dsl = [
  // Desktop: no frame fill — HoverMedia owns the plane
  `SET hX5NduSNi fill="null"`,
  `SET z2kRrpzAZ visible="true" $control__image="${HERO}" $control__imageB="var(--variable-ppzgDk7Mi)" $control__showView="false"`,

  // Tablet/Phone: CMS hero via frame fill (code-component ResponsiveImage binds fail on BP replicas)
  `SET aJLpuUP0qhX5NduSNi fill="${HERO}" fillImagePositionX="center" fillImagePositionY="center" overflow="clip"`,
  `SET Qonafp_oDhX5NduSNi fill="${HERO}" fillImagePositionX="center" fillImagePositionY="center" overflow="clip"`,
  `SET aJLpuUP0qz2kRrpzAZ visible="false"`,
  `SET Qonafp_oDz2kRrpzAZ visible="false"`,

  // Keep collection list templates correct
  `SET km7dUqZI9 collectionList.collection="Neighbourhoods" collectionList.repeatedDescendantId="i56eWdACt"`,
  `SET aJLpuUP0qkm7dUqZI9 collectionList.collection="Neighbourhoods" collectionList.repeatedDescendantId="aJLpuUP0qi56eWdACt"`,
  `SET Qonafp_oDkm7dUqZI9 collectionList.collection="Neighbourhoods" collectionList.repeatedDescendantId="Qonafp_oDi56eWdACt"`,
].join(";\n")

const res = await framer.agent.applyChanges(dsl, { pagePath })

const check = {}
for (const [k, id] of [
  ["photoD", "hX5NduSNi"],
  ["photoT", "aJLpuUP0qhX5NduSNi"],
  ["photoP", "Qonafp_oDhX5NduSNi"],
  ["mediaD", "z2kRrpzAZ"],
  ["mediaT", "aJLpuUP0qz2kRrpzAZ"],
  ["mediaP", "Qonafp_oDz2kRrpzAZ"],
  ["listT", "aJLpuUP0qkm7dUqZI9"],
  ["listP", "Qonafp_oDkm7dUqZI9"],
]) {
  const n = await framer.agent.serialize({ id, depth: 1 }, { pagePath })
  const a = n.attributes || {}
  check[k] = {
    fill: a.fill,
    visible: a.visible,
    image: a.$control__image,
    collectionList: a.collectionList,
  }
}

console.log(JSON.stringify({ message: res?.message, errors: res?.errors, check }, null, 2))

const pagePath = "/neighbourhoods"
const HERO = "var(--variable-dM8yn13g7)"
const MAP = "var(--variable-ppzgDk7Mi)"

const dsl = [
  // Collection lists → local card templates (critical)
  `SET km7dUqZI9 collectionList.collection="Neighbourhoods" collectionList.repeatedDescendantId="i56eWdACt"`,
  `SET aJLpuUP0qkm7dUqZI9 collectionList.collection="Neighbourhoods" collectionList.repeatedDescendantId="aJLpuUP0qi56eWdACt"`,
  `SET Qonafp_oDkm7dUqZI9 collectionList.collection="Neighbourhoods" collectionList.repeatedDescendantId="Qonafp_oDi56eWdACt"`,

  // Photos: no fill; media owns plane
  `SET hX5NduSNi fill="null" height="380px" minHeight="380px" maxHeight="380px" overflow="clip"`,
  `SET aJLpuUP0qhX5NduSNi fill="null" height="300px" minHeight="300px" maxHeight="300px" overflow="clip"`,
  `SET Qonafp_oDhX5NduSNi fill="null" height="300px" minHeight="300px" maxHeight="300px" overflow="clip"`,

  // Primary media — full
  `SET z2kRrpzAZ visible="true" opacity="1" position="absolute" left="0px" top="0px" width="100%" height="100%" pointerEvents="auto" $control__image="${HERO}" $control__imageB="${MAP}" $control__showView="false" $control__interval="900" $control__zoom="1.04"`,

  // BP media — restore like PropertyCard (visible + same binds)
  `SET aJLpuUP0qz2kRrpzAZ visible="true" opacity="1" position="absolute" left="0px" top="0px" width="100%" height="100%" pointerEvents="auto" $control__image="${HERO}" $control__imageB="${MAP}" $control__showView="false" $control__interval="900" $control__zoom="1.04"`,
  `SET Qonafp_oDz2kRrpzAZ visible="true" opacity="1" position="absolute" left="0px" top="0px" width="100%" height="100%" pointerEvents="auto" $control__image="${HERO}" $control__imageB="${MAP}" $control__showView="false" $control__interval="900" $control__zoom="1.04"`,

  // Hide orphans everywhere
  `SET SdpdtqZyv visible="false" opacity="0" width="0px" height="0px" pointerEvents="none"`,
  `SET be6Jm161G visible="false" opacity="0" width="0px" height="0px" pointerEvents="none"`,
  `SET aJLpuUP0qSdpdtqZyv visible="false" opacity="0" width="0px" height="0px" pointerEvents="none"`,
  `SET aJLpuUP0qbe6Jm161G visible="false" opacity="0" width="0px" height="0px" pointerEvents="none"`,
  `SET Qonafp_oDSdpdtqZyv visible="false" opacity="0" width="0px" height="0px" pointerEvents="none"`,
  `SET Qonafp_oDbe6Jm161G visible="false" opacity="0" width="0px" height="0px" pointerEvents="none"`,
].join(";\n")

const res = await framer.agent.applyChanges(dsl, { pagePath })

const check = {}
for (const [k, id] of [
  ["listT", "aJLpuUP0qkm7dUqZI9"],
  ["listP", "Qonafp_oDkm7dUqZI9"],
  ["mediaT", "aJLpuUP0qz2kRrpzAZ"],
  ["mediaP", "Qonafp_oDz2kRrpzAZ"],
]) {
  const n = await framer.agent.serialize({ id, depth: 1 }, { pagePath })
  check[k] = {
    collectionList: n.attributes?.collectionList,
    visible: n.attributes?.visible,
    w: n.attributes?.width,
    h: n.attributes?.height,
    image: n.attributes?.$control__image,
    imageB: n.attributes?.$control__imageB,
  }
}

const pub = await framer.publish()
console.log(JSON.stringify({ message: res?.message, check, deploy: pub?.deployment?.id }, null, 2))

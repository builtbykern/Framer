const pagePath = "/neighbourhoods"
const HERO = "var(--variable-dM8yn13g7)"

// Remove orphan HoverMedia nodes created during recreate (primary IDs cascade to BPs)
const dsl1 = [`DELETE SdpdtqZyv`, `DELETE be6Jm161G`].join(";\n")
const res1 = await framer.agent.applyChanges(dsl1, { pagePath })

const dsl2 = [
  // Desktop: single HoverMedia only
  `SET z2kRrpzAZ visible="true" opacity="1" width="100%" height="100%" position="absolute" left="0px" top="0px" pointerEvents="auto" $control__image="${HERO}" $control__imageB="var(--variable-ppzgDk7Mi)" $control__showView="false"`,
  `SET hX5NduSNi fill="null"`,
  // T/P: hide remaining replica of primary media; hero via frame fill
  `SET aJLpuUP0qz2kRrpzAZ visible="false" opacity="0" width="0px" height="0px" pointerEvents="none"`,
  `SET Qonafp_oDz2kRrpzAZ visible="false" opacity="0" width="0px" height="0px" pointerEvents="none"`,
  `SET aJLpuUP0qhX5NduSNi fill="${HERO}" fillImagePositionX="center" fillImagePositionY="center" overflow="clip"`,
  `SET Qonafp_oDhX5NduSNi fill="${HERO}" fillImagePositionX="center" fillImagePositionY="center" overflow="clip"`,
  `SET aJLpuUP0qkm7dUqZI9 collectionList.collection="Neighbourhoods" collectionList.repeatedDescendantId="aJLpuUP0qi56eWdACt"`,
  `SET Qonafp_oDkm7dUqZI9 collectionList.collection="Neighbourhoods" collectionList.repeatedDescendantId="Qonafp_oDi56eWdACt"`,
].join(";\n")
const res2 = await framer.agent.applyChanges(dsl2, { pagePath })

const out = {}
for (const [k, id] of [
  ["D", "hX5NduSNi"],
  ["T", "aJLpuUP0qhX5NduSNi"],
  ["P", "Qonafp_oDhX5NduSNi"],
]) {
  const n = await framer.agent.serialize({ id, depth: 2 }, { pagePath })
  out[k] = {
    fill: n.attributes?.fill,
    kids: (n.children || []).map((c) => ({
      id: c.id,
      visible: c.attributes?.visible,
      w: c.attributes?.width,
      h: c.attributes?.height,
      opacity: c.attributes?.opacity,
    })),
  }
}

console.log(JSON.stringify({ res1: res1?.message, err1: res1?.errors, res2: res2?.message, out }, null, 2))

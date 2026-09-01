const pagePath = "/neighbourhoods"

const dsl = [
  // Fix BP collection list templates to their own card replicas
  `SET aJLpuUP0qkm7dUqZI9 collectionList.collection="Neighbourhoods" collectionList.repeatedDescendantId="aJLpuUP0qi56eWdACt"`,
  `SET Qonafp_oDkm7dUqZI9 collectionList.collection="Neighbourhoods" collectionList.repeatedDescendantId="Qonafp_oDi56eWdACt"`,
  // Keep Desktop correct
  `SET km7dUqZI9 collectionList.collection="Neighbourhoods" collectionList.repeatedDescendantId="i56eWdACt"`,
  // Ensure image binds on all media instances
  `SET z2kRrpzAZ $control__image="var(--variable-dM8yn13g7)" $control__imageB="var(--variable-ppzgDk7Mi)"`,
  `SET aJLpuUP0qz2kRrpzAZ $control__image="var(--variable-dM8yn13g7)" $control__imageB="var(--variable-ppzgDk7Mi)"`,
  `SET Qonafp_oDz2kRrpzAZ $control__image="var(--variable-dM8yn13g7)" $control__imageB="var(--variable-ppzgDk7Mi)"`,
].join(";\n")

const res = await framer.agent.applyChanges(dsl, { pagePath })

const check = {}
for (const [label, id] of [
  ["D", "km7dUqZI9"],
  ["T", "aJLpuUP0qkm7dUqZI9"],
  ["P", "Qonafp_oDkm7dUqZI9"],
]) {
  const n = await framer.agent.serialize({ id, depth: 1 }, { pagePath })
  check[label] = {
    kids: (await framer.agent.serialize({ id, depth: 2 }, { pagePath })).children?.map((c) => c.id),
    collectionList: n.attributes?.collectionList,
  }
}

console.log(JSON.stringify({ message: res?.message, errors: res?.errors, check }, null, 2))

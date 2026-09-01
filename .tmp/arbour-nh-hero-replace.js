const pagePath = "/neighbourhoods"
const HERO = "var(--variable-dM8yn13g7)"
const COMP = "codeFile/NN1s2o1:default"

const res1 = await framer.agent.applyChanges(`DELETE BDQcZz5ik`, { pagePath })
const res2 = await framer.agent.applyChanges(
  `+ComponentInstanceNode nhHero parent="i56eWdACt" component="${COMP}"`,
  { pagePath }
)
const res3 = await framer.agent.applyChanges(
  [
    `SET nhHero name="Arbour_TerritoryHero" position="relative" width="1fr" height="380px" $control__image="${HERO}"`,
  ].join(";\n"),
  { pagePath }
)

await framer.setParent(
  (
    await framer.agent.serialize({ id: "i56eWdACt", depth: 2 }, { pagePath })
  ).children.find((c) => /TerritoryHero|nhHero|NN1s2o1/i.test(c.name + c.attributes?.component))
    ?.id || "nhHero",
  "i56eWdACt",
  0
)

// Re-read after setParent - find hero id
const card = await framer.agent.serialize({ id: "i56eWdACt", depth: 2 }, { pagePath })
const hero = (card.children || []).find((c) => c.type === "ComponentInstanceNode" && c.attributes?.visible !== "false")
const heroId = hero?.id

const dslBp = []
if (heroId) {
  dslBp.push(
    `SET ${heroId} $control__image="${HERO}" width="1fr" height="380px" position="relative"`
  )
  dslBp.push(
    `SET aJLpuUP0q${heroId} $control__image="${HERO}" width="1fr" height="300px" position="relative"`
  )
  dslBp.push(
    `SET Qonafp_oD${heroId} $control__image="${HERO}" width="1fr" height="300px" position="relative"`
  )
}
dslBp.push(
  `SET km7dUqZI9 collectionList.collection="Neighbourhoods" collectionList.repeatedDescendantId="i56eWdACt"`
)
dslBp.push(
  `SET aJLpuUP0qkm7dUqZI9 collectionList.collection="Neighbourhoods" collectionList.repeatedDescendantId="aJLpuUP0qi56eWdACt"`
)
dslBp.push(
  `SET Qonafp_oDkm7dUqZI9 collectionList.collection="Neighbourhoods" collectionList.repeatedDescendantId="Qonafp_oDi56eWdACt"`
)

const res4 = await framer.agent.applyChanges(dslBp.join(";\n"), { pagePath })
const pub = await framer.publish()

console.log(
  JSON.stringify(
    {
      res1: res1?.message,
      res2: res2?.message,
      res3: res3?.message,
      res4: res4?.message,
      err4: res4?.errors,
      kids: (card.children || []).map((c) => ({
        id: c.id,
        name: c.name,
        type: c.type,
        img: c.attributes?.["$control__image"],
        h: c.attributes?.height,
      })),
      heroId,
      deploy: pub?.deployment?.id,
    },
    null,
    2
  )
)

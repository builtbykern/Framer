const pagePath = "/neighbourhoods"
const HERO = "var(--variable-dM8yn13g7)"
const dsl = [
  `SET BDQcZz5ik component="codeFile/NN1s2o1:default" $control__image="${HERO}" width="1fr" height="380px" position="relative"`,
  `SET aJLpuUP0qBDQcZz5ik component="codeFile/NN1s2o1:default" $control__image="${HERO}" width="1fr" height="300px" position="relative"`,
  `SET Qonafp_oDBDQcZz5ik component="codeFile/NN1s2o1:default" $control__image="${HERO}" width="1fr" height="300px" position="relative"`,
].join(";\n")
const res = await framer.agent.applyChanges(dsl, { pagePath })
const n = await framer.agent.serialize({ id: "BDQcZz5ik", depth: 1 }, { pagePath })
const nT = await framer.agent.serialize({ id: "aJLpuUP0qBDQcZz5ik", depth: 1 }, { pagePath })
const pub = await framer.publish()
console.log(
  JSON.stringify(
    {
      message: res?.message,
      errors: res?.errors,
      D: {
        comp: n.attributes?.component,
        img: n.attributes?.["$control__image"],
        h: n.attributes?.height,
      },
      T: {
        comp: nT.attributes?.component,
        img: nT.attributes?.["$control__image"],
        h: nT.attributes?.height,
      },
      deploy: pub?.deployment?.id,
    },
    null,
    2
  )
)

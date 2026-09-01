const pagePath = "/neighbourhoods"
const HERO = "var(--variable-dM8yn13g7)"

// Native frame with CMS fill on PRIMARY only; BP only overrides height
const res1 = await framer.agent.applyChanges(
  `+FrameNode nhPhotoFill parent="i56eWdACt"`,
  { pagePath }
)
const res2 = await framer.agent.applyChanges(
  `SET nhPhotoFill name="Territory Photo Fill" position="relative" width="1fr" height="380px" overflow="clip" fill="${HERO}" fillImagePositionX="center" fillImagePositionY="center"`,
  { pagePath }
)

const card = await framer.agent.serialize({ id: "i56eWdACt", depth: 2 }, { pagePath })
const fillNode = (card.children || []).find((c) => c.name === "Territory Photo Fill")
const fillId = fillNode?.id
console.log("fillId", fillId)

if (fillId) {
  await framer.setParent(fillId, "i56eWdACt", 0)
  // Only height on BP — do NOT re-set fill (preserve inheritance)
  const dsl = [
    `SET aJLpuUP0q${fillId} height="300px" width="1fr"`,
    `SET Qonafp_oD${fillId} height="300px" width="1fr"`,
    // Hide code components / old photo on all BPs for this test
    `SET Y2QseQtDb visible="false" height="0px"`,
    `SET aJLpuUP0qY2QseQtDb visible="false" height="0px"`,
    `SET Qonafp_oDY2QseQtDb visible="false" height="0px"`,
    `SET BDQcZz5ik visible="false" height="0px"`,
    `SET aJLpuUP0qBDQcZz5ik visible="false" height="0px"`,
    `SET Qonafp_oDBDQcZz5ik visible="false" height="0px"`,
    `SET hX5NduSNi visible="false" height="0px"`,
  ].join(";\n")
  const res3 = await framer.agent.applyChanges(dsl, { pagePath })
  const t = await framer.agent.serialize({ id: `aJLpuUP0q${fillId}`, depth: 1 }, { pagePath })
  const d = await framer.agent.serialize({ id: fillId, depth: 1 }, { pagePath })
  const pub = await framer.publish()
  console.log(
    JSON.stringify(
      {
        res1: res1?.message,
        res2: res2?.message,
        res3: res3?.message,
        fillD: d.attributes?.fill,
        fillT: t.attributes?.fill,
        heightT: t.attributes?.height,
        deploy: pub?.deployment?.id,
      },
      null,
      2
    )
  )
}

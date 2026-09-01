const pagePath = "/neighbourhoods"
const HERO = "var(--variable-dM8yn13g7)"
const MAP = "var(--variable-ppzgDk7Mi)"
const FILL = "pk4EKsdIR"

// 1) Photo fill first in card
await framer.setParent(FILL, "i56eWdACt", 0)

// 2) Move HoverMedia into fill frame as absolute overlay (desktop cycle)
// Prefer existing HoverMedia BDQcZz5ik or recreate from nMMl08t
const COMP = "codeFile/nMMl08t:default"

// Hide clutter nodes
const hide = [
  "Y2QseQtDb",
  "hX5NduSNi",
  "SdpdtqZyv",
  "be6Jm161G",
]
const cmds = []

// Ensure fill looks right
cmds.push(
  `SET ${FILL} name="Territory Photograph" position="relative" width="1fr" height="380px" overflow="clip" fill="${HERO}" fillImagePositionX="center" fillImagePositionY="center" visible="true"`
)
cmds.push(`SET aJLpuUP0q${FILL} height="300px" width="1fr" visible="true"`)
cmds.push(`SET Qonafp_oD${FILL} height="300px" width="1fr" visible="true"`)

// HoverMedia as overlay inside fill — desktop only
cmds.push(
  `SET BDQcZz5ik visible="true" position="absolute" left="0px" top="0px" width="100%" height="100%" $control__image="${HERO}" $control__imageB="${MAP}" $control__showView="false" $control__zoom="1.04" $control__interval="900"`
)
// Move hover into fill parent
await framer.setParent("BDQcZz5ik", FILL, 0)

cmds.push(
  `SET aJLpuUP0qBDQcZz5ik visible="false"`
)
cmds.push(
  `SET Qonafp_oDBDQcZz5ik visible="false"`
)

for (const id of hide) {
  cmds.push(`SET ${id} visible="false" height="0px" width="0px"`)
  cmds.push(`SET aJLpuUP0q${id} visible="false" height="0px" width="0px"`)
  cmds.push(`SET Qonafp_oD${id} visible="false" height="0px" width="0px"`)
}

// collection lists
cmds.push(
  `SET km7dUqZI9 collectionList.collection="Neighbourhoods" collectionList.repeatedDescendantId="i56eWdACt"`
)
cmds.push(
  `SET aJLpuUP0qkm7dUqZI9 collectionList.collection="Neighbourhoods" collectionList.repeatedDescendantId="aJLpuUP0qi56eWdACt"`
)
cmds.push(
  `SET Qonafp_oDkm7dUqZI9 collectionList.collection="Neighbourhoods" collectionList.repeatedDescendantId="Qonafp_oDi56eWdACt"`
)

const res = await framer.agent.applyChanges(cmds.join(";\n"), { pagePath })

const card = await framer.agent.serialize({ id: "i56eWdACt", depth: 3 }, { pagePath })
const cardT = await framer.agent.serialize({ id: "aJLpuUP0qi56eWdACt", depth: 3 }, { pagePath })

function summarize(c) {
  return (c.children || []).map((k) => ({
    id: k.id,
    name: k.name,
    vis: k.attributes?.visible,
    h: k.attributes?.height,
    fill: k.attributes?.fill,
    kids: (k.children || []).map((x) => ({
      id: x.id,
      name: x.name,
      vis: x.attributes?.visible,
      img: x.attributes?.["$control__image"],
    })),
  }))
}

const pub = await framer.publish()
console.log(
  JSON.stringify(
    {
      message: res?.message,
      errors: res?.errors,
      D: summarize(card),
      T: summarize(cardT),
      deploy: pub?.deployment?.id,
    },
    null,
    2
  )
)

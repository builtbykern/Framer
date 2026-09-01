const pagePath = "/neighbourhoods"
const card = await framer.agent.serialize({ id: "i56eWdACt", depth: 3 }, { pagePath })
const cardT = await framer.agent.serialize({ id: "aJLpuUP0qi56eWdACt", depth: 3 }, { pagePath })
const cardP = await framer.agent.serialize({ id: "Qonafp_oDi56eWdACt", depth: 3 }, { pagePath })
const listT = await framer.agent.serialize({ id: "aJLpuUP0qkm7dUqZI9", depth: 1 }, { pagePath })
const listP = await framer.agent.serialize({ id: "Qonafp_oDkm7dUqZI9", depth: 1 }, { pagePath })

function sum(c) {
  return {
    pad: c.attributes?.padding,
    kids: (c.children || []).map((k) => ({
      id: k.id,
      name: k.name,
      type: k.type,
      vis: k.attributes?.visible,
      h: k.attributes?.height,
      w: k.attributes?.width,
      pos: k.attributes?.position,
      fill: k.attributes?.fill,
      pad: k.attributes?.padding,
      kids: (k.children || []).map((x) => ({
        id: x.id,
        name: x.name,
        vis: x.attributes?.visible,
        img: x.attributes?.["$control__image"],
        imgB: x.attributes?.["$control__imageB"],
      })),
    })),
  }
}

console.log(
  JSON.stringify(
    {
      D: sum(card),
      T: sum(cardT),
      P: sum(cardP),
      listT: listT.attributes?.collectionList,
      listP: listP.attributes?.collectionList,
    },
    null,
    2
  )
)

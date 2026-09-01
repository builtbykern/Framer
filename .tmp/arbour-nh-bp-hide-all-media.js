const pagePath = "/neighbourhoods"
const HERO = "var(--variable-dM8yn13g7)"

const photoD = await framer.agent.serialize({ id: "hX5NduSNi", depth: 2 }, { pagePath })
const photoT = await framer.agent.serialize({ id: "aJLpuUP0qhX5NduSNi", depth: 2 }, { pagePath })
const photoP = await framer.agent.serialize({ id: "Qonafp_oDhX5NduSNi", depth: 2 }, { pagePath })

function kids(p) {
  return (p.children || []).map((c) => ({
    id: c.id,
    type: c.type,
    name: c.name,
    visible: c.attributes?.visible,
    image: c.attributes?.$control__image,
    w: c.attributes?.width,
    h: c.attributes?.height,
  }))
}

console.log(
  JSON.stringify(
    { D: kids(photoD), T: kids(photoT), P: kids(photoP), fillT: photoT.attributes?.fill },
    null,
    2
  )
)

// Hide ALL media instances on T/P; keep only Desktop primary visible
const hideIds = [
  ...(photoT.children || []).map((c) => c.id),
  ...(photoP.children || []).map((c) => c.id),
]

const cmds = hideIds.map(
  (id) =>
    `SET ${id} visible="false" opacity="0" width="0px" height="0px" pointerEvents="none"`
)
cmds.push(
  `SET aJLpuUP0qhX5NduSNi fill="${HERO}" fillImagePositionX="center" fillImagePositionY="center" overflow="clip"`
)
cmds.push(
  `SET Qonafp_oDhX5NduSNi fill="${HERO}" fillImagePositionX="center" fillImagePositionY="center" overflow="clip"`
)
cmds.push(`SET z2kRrpzAZ visible="true" opacity="1" width="100%" height="100%" pointerEvents="auto"`)
cmds.push(`SET hX5NduSNi fill="null"`)

const res = await framer.agent.applyChanges(cmds.join(";\n"), { pagePath })
console.log("APPLY", JSON.stringify({ message: res?.message, errors: res?.errors, hidden: hideIds }))

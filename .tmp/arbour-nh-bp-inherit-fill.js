const pagePath = "/neighbourhoods"

// Compare how Name text vs Hero fill are bound on D vs T
const nodes = [
  ["titleD", "rie14TaT9"],
  ["titleT", "aJLpuUP0qrie14TaT9"],
  ["photoD", "hX5NduSNi"],
  ["photoT", "aJLpuUP0qhX5NduSNi"],
  ["mediaD", "z2kRrpzAZ"],
  ["mediaT", "aJLpuUP0qz2kRrpzAZ"],
]

const out = {}
for (const [k, id] of nodes) {
  const n = await framer.agent.serialize({ id, depth: 1 }, { pagePath })
  const a = n.attributes || {}
  out[k] = {
    text: a.text,
    fill: a.fill,
    image: a.$control__image,
    imageB: a.$control__imageB,
    visible: a.visible,
    // any variable-looking values
    vars: Object.fromEntries(
      Object.entries(a).filter(([, v]) => String(v).includes("variable"))
    ),
  }
}

// Set PRIMARY photo fill to hero, clear T/P fill to try inherit (null)
const dsl = [
  `SET hX5NduSNi fill="var(--variable-dM8yn13g7)" fillImagePositionX="center" fillImagePositionY="center"`,
  `SET aJLpuUP0qhX5NduSNi fill="null"`,
  `SET Qonafp_oDhX5NduSNi fill="null"`,
].join(";\n")
const res = await framer.agent.applyChanges(dsl, { pagePath })

const after = {}
for (const id of ["hX5NduSNi", "aJLpuUP0qhX5NduSNi", "Qonafp_oDhX5NduSNi"]) {
  const n = await framer.agent.serialize({ id, depth: 1 }, { pagePath })
  after[id] = { fill: n.attributes?.fill }
}

console.log(JSON.stringify({ out, res: res?.message, after }, null, 2))

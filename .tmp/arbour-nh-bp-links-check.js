const pagePath = "/neighbourhoods"
const ids = [
  ["cardD", "i56eWdACt"],
  ["cardT", "aJLpuUP0qi56eWdACt"],
  ["cardP", "Qonafp_oDi56eWdACt"],
  ["photoD", "hX5NduSNi"],
  ["photoT", "aJLpuUP0qhX5NduSNi"],
  ["photoP", "Qonafp_oDhX5NduSNi"],
  ["mediaD", "z2kRrpzAZ"],
  ["mediaT", "aJLpuUP0qz2kRrpzAZ"],
  ["mediaP", "Qonafp_oDz2kRrpzAZ"],
  ["viewD", "d9SNjsdke"],
  ["viewT", "aJLpuUP0qd9SNjsdke"],
  ["viewP", "Qonafp_oDd9SNjsdke"],
]

const out = {}
for (const [label, id] of ids) {
  const n = await framer.agent.serialize({ id, depth: 1 }, { pagePath })
  const a = n.attributes || {}
  out[label] = {
    id,
    type: n.type,
    name: n.name,
    link: a.link ?? null,
    href: a.href ?? null,
    cursor: a.cursor ?? null,
    visible: a.visible,
    opacity: a.opacity,
    overflow: a.overflow,
    component: a.component ?? n.component ?? n.$componentIdentifier ?? null,
    image: a.$control__image ?? null,
    imageB: a.$control__imageB ?? null,
    showView: a.$control__showView ?? null,
    w: a.width,
    h: a.height,
    position: a.position,
  }
}

console.log(JSON.stringify(out, null, 2))

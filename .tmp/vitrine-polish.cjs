function urls(pack) {
    return (pack?.results || []).map((b) => ({
        url: b.url,
        alt: String(b.alt || "").replace(/"/g, ""),
    }))
}

const q = (query, orientation) =>
    framer.agent.queryImages({
        source: "unsplash",
        query,
        count: 2,
        orientation,
        width: 1400,
    })

const [ring, bowl, linen, brass, cup, wire, tray, hook] = await Promise.all([
    q("gold ring on linen fabric still life", "squarish"),
    q("ceramic bowl on wooden table still life", "squarish"),
    q("folded linen cloth stack", "landscape"),
    q("brass jewelry on cloth still life", "landscape"),
    q("handmade ceramic cup on table", "squarish"),
    q("copper wire coil on wood", "portrait"),
    q("square wooden tray empty", "squarish"),
    q("iron wall hook hardware closeup", "portrait"),
])

const packs = {
    ring: urls(ring),
    bowl: urls(bowl),
    linen: urls(linen),
    brass: urls(brass),
    cup: urls(cup),
    wire: urls(wire),
    tray: urls(tray),
    hook: urls(hook),
}

function pair(a, b, i = 0, j = 1) {
    const cover = a[i] || a[0] || b[0]
    const still = b[j] || b[0] || a[1] || a[0]
    return { cover, still }
}

const appear =
    'appearEffect.trigger="onInView" appearEffect.replay="false" appearEffect.enter.opacity="0" appearEffect.enter.x="0" appearEffect.enter.y="0" appearEffect.enter.scale="1" appearEffect.enter.transition="ease-out 0.4s 0s"'

const coverIds = [
    "QYwZhiOCq",
    "BZgqwOKfTQYwZhiOCq",
    "GLlag6b9RQYwZhiOCq",
    "S4aeyJLQaQYwZhiOCq",
]
const stillIds = [
    "aDU_xPLrv",
    "BZgqwOKfTaDU_xPLrv",
    "GLlag6b9RaDU_xPLrv",
    "S4aeyJLQaaDU_xPLrv",
]

const cmds = [
    'SET GiR6fF7o5 gap="12px";',
    'SET Nx5jccWgM gap="10px";',
    'SET tKUMOkWpP gap="8px";',
    'SET eGJAoz6x_ layout="stack" position="relative" height="1px" width="1fr";',
    'SET yAd2lMDSW overflow="auto" hideScrollbars="true";',
    'SET t62LHpSTayAd2lMDSW overflow="auto" hideScrollbars="true";',
    'SET u75vHQkARyAd2lMDSW overflow="auto" hideScrollbars="true";',
    'SET augiA20Il layoutTemplate="null";',
]
for (const id of coverIds) cmds.push(`SET ${id} ${appear};`)
for (const id of stillIds) cmds.push(`SET ${id} ${appear};`)

const items = [
    ["lkZBIAg86", pair(packs.ring, packs.linen)],
    ["tZytgw_pu", pair(packs.bowl, packs.tray)],
    ["N8rSuGdDW", pair(packs.brass, packs.ring)],
    ["vWwUi2iXi", pair(packs.linen, packs.linen)],
    ["EDUlD2m19", pair(packs.cup, packs.bowl)],
    ["RXZYU_SGB", pair(packs.wire, packs.brass)],
    ["X3kJRxUxX", pair(packs.tray, packs.bowl)],
    ["zyvPp0qI0", pair(packs.hook, packs.wire)],
]
for (const [id, p] of items) {
    if (!p.cover?.url || !p.still?.url) continue
    cmds.push(
        `SET ${id} $control__cover.src="${p.cover.url}" $control__cover.alt="${p.cover.alt || "piece"}" $control__still.src="${p.still.url}" $control__still.alt="${p.still.alt || "still"}";`
    )
}

const r = await framer.agent.applyChanges(cmds.join(" "), { pagePath: "/" })
console.log(
    JSON.stringify(
        {
            counts: Object.fromEntries(
                Object.entries(packs).map(([k, v]) => [k, v.length])
            ),
            r,
        },
        null,
        2
    )
)

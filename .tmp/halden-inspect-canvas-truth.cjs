const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

function pick(n, extra = []) {
    if (!n) return null
    const a = n.attributes || n
    const keys = [
        "id",
        "name",
        "type",
        "width",
        "height",
        "position",
        "top",
        "left",
        "layout",
        "stackDirection",
        "stackAlignment",
        "stackDistribution",
        "gap",
        "padding",
        "overflow",
        "aspectRatio",
        "visible",
        "opacity",
        "$breakpoints",
        "$variants",
        ...extra,
    ]
    const out = { id: n.id, name: n.name || a.name, type: n.type }
    for (const k of keys) {
        if (a[k] !== undefined) out[k] = a[k]
    }
    if (n.children) {
        out.children = n.children.map((c) => ({
            id: c.id,
            name: c.name || c.attributes?.name,
            type: c.type,
            w: c.attributes?.width,
            h: c.attributes?.height,
            pos: c.attributes?.position,
            gap: c.attributes?.gap,
            layout: c.attributes?.layout,
            dir: c.attributes?.stackDirection,
        }))
    }
    return out
}

const card = await framer.agent.serialize(
    { id: "gSGwySyKV", depth: 3, attributeFilter: [
        "name", "width", "height", "position", "top", "left", "layout",
        "stackDirection", "stackAlignment", "stackDistribution", "gap",
        "padding", "overflow", "aspectRatio", "visible", "$breakpoints", "$variants",
    ] },
    { pagePath: "/" }
)
const list = await framer.agent.serialize(
    { id: "H9TnltXVB", depth: 2, attributeFilter: [
        "name", "width", "height", "layout", "stackDirection", "gap",
        "padding", "overflow", "$breakpoints", "$variants", "gridColumns",
    ] },
    { pagePath: "/" }
)
const cover = await framer.agent.getNode({ id: "nt9Gs3MMs" }, { pagePath: "/" })
const planeT = await framer.agent.getNode({ id: "BjqrvIntTRV7bjlgdh" }, { pagePath: "/" })
const planeP = await framer.agent.getNode({ id: "nyI5jW7lARV7bjlgdh" }, { pagePath: "/" })
const homeT = await framer.agent.getNode({ id: "BjqrvIntT" }, { pagePath: "/" })

const replicaIds = [
    "BjqrvIntTH9TnltXVB",
    "nyI5jW7lAH9TnltXVB",
    "BjqrvIntTgSGwySyKV",
    "nyI5jW7lAgSGwySyKV",
    "BjqrvIntTnt9Gs3MMs",
    "nyI5jW7lAnt9Gs3MMs",
]
const replicas = {}
for (const id of replicaIds) {
    try {
        const n = await framer.agent.getNode({ id }, { pagePath: "/" })
        replicas[id] = n ? pick(n) : null
    } catch (e) {
        replicas[id] = String(e)
    }
}

console.log(JSON.stringify({
    project: info.name,
    card: pick(card),
    list: pick(list),
    cover: pick(cover),
    planeT: pick(planeT, ["$control__view", "$control__padTop", "$control__padBottom", "$control__collection", "$control__workList"]),
    planeP: pick(planeP, ["$control__view", "$control__padTop", "$control__padBottom", "$control__collection", "$control__workList"]),
    homeT: pick(homeT, ["width", "height"]),
    replicas,
}, null, 2))

const ids = [
    "augiA20Il",
    "WQLkyLRf1",
    "BjqrvIntT",
    "nyI5jW7lA",
    "H9TnltXVB",
    "RV7bjlgdh",
    "gSGwySyKV",
    "nt9Gs3MMs",
    "cMyCjMOpL",
]
const out = {}
for (const id of ids) {
    try {
        const r = await framer.agent.getRect({ id }, { pagePath: "/" })
        const n = await framer.agent.getNode({ id }, { pagePath: "/" })
        const a = n?.attributes || {}
        out[id] = {
            name: n?.name || a.name,
            rect: r,
            left: a.left,
            top: a.top,
            pos: a.position,
            vis: a.visible,
            w: a.width,
            h: a.height,
        }
    } catch (e) {
        out[id] = String(e)
    }
}

const grid = await framer.agent.getNode({ id: "cMyCjMOpL" }, { pagePath: "/" })
out.stillGridKids = (grid?.children || []).map((c) => ({
    id: c.id,
    name: c.name || c.attributes?.name,
    type: c.type,
    vis: c.attributes?.visible,
    controls: Object.fromEntries(
        Object.entries(c.attributes || {}).filter(([k]) => k.startsWith("$control"))
    ),
}))

console.log(JSON.stringify(out, null, 2))

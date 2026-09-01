const ids = [
    "RV7bjlgdh",
    "BjqrvIntTRV7bjlgdh",
    "nyI5jW7lARV7bjlgdh",
    "BjqrvIntTbEk1u9XFC",
    "nyI5jW7lAbEk1u9XFC",
    "bEk1u9XFC",
]
const out = {}
for (const id of ids) {
    try {
        const n = await framer.agent.getNode({ id }, { pagePath: "/" })
        const a = n?.attributes || {}
        out[id] = {
            name: n?.name,
            pos: a.position,
            h: a.height,
            padTop: a.$control__padTop ?? a.padTop,
            padBottom: a.$control__padBottom ?? a.padBottom,
            view: a.$control__view ?? a.view,
            keys: Object.keys(a)
                .filter((k) => /pad|view|control/i.test(k))
                .slice(0, 40),
        }
        for (const k of Object.keys(a)) {
            if (/pad|view|collection/i.test(k)) out[id][k] = a[k]
        }
    } catch (e) {
        out[id] = String(e)
    }
}
console.log(JSON.stringify(out, null, 2))

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

function attr(n) {
    const a = n?.attributes || {}
    return {
        id: n?.id,
        name: n?.name || a.name,
        width: a.width,
        height: a.height,
        position: a.position,
        view: a.$control__view,
        padTop: a.$control__padTop,
        appear: a.$control__motion?.appear ?? a["$control__motion.appear"],
        workList: a.$control__workList,
    }
}

const ids = [
    "RV7bjlgdh",
    "BjqrvIntTRV7bjlgdh",
    "nyI5jW7lARV7bjlgdh",
    "nt9Gs3MMs",
    "gSGwySyKV",
    "WQLkyLRf1",
    "BjqrvIntT",
]
const nodes = {}
for (const id of ids) {
    const n = await framer.agent.getNode({ id }, { pagePath: "/" })
    nodes[id] = attr(n)
}

console.log(JSON.stringify({ project: info.name, nodes }, null, 2))

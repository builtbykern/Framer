const fs = require("fs")
const path = require("path")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

function slim(n) {
    if (!n) return null
    const a = n.attributes || {}
    return {
        id: n.id,
        name: n.name || a.name,
        w: a.width,
        h: a.height,
        pos: a.position,
        pad: a.padding,
        gap: a.gap,
        overflow: a.overflow,
        view: a.$control__view,
        padTop: a.$control__padTop,
        padBottom: a.$control__padBottom,
        workList: a.$control__workList,
    }
}

const ids = [
    "BjqrvIntT",
    "nyI5jW7lA",
    "BjqrvIntTRV7bjlgdh",
    "nyI5jW7lARV7bjlgdh",
    "nt9Gs3MMs",
    "gSGwySyKV",
    "YonVwWSco",
    "cMyCjMOpL",
    "yGFlVus2I",
    "FddpNYFNF",
    "GAokM9PPJ",
    "XwtyrQVdF",
]
const nodes = {}
for (const id of ids) {
    const n = await framer.agent.getNode({ id }, { pagePath: "/" })
    nodes[id] = slim(n)
}

const out = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(out, { recursive: true })
const shots = {}
for (const [id, name] of [
    ["BjqrvIntT", "t-canvas.jpg"],
    ["nyI5jW7lA", "p-canvas.jpg"],
    ["BjqrvIntTRV7bjlgdh", "t-plane.jpg"],
    ["nyI5jW7lARV7bjlgdh", "p-plane.jpg"],
]) {
    const r = await framer.screenshot(id, { format: "jpeg", scale: 2 })
    fs.writeFileSync(path.join(out, name), r.data)
    shots[name] = r.data.length
}

console.log(JSON.stringify({ project: info.name, nodes, shots }, null, 2))

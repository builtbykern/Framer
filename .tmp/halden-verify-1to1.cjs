const fs = require("fs")
const path = require("path")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const applied = await framer.agent.applyChanges(
    [
        'SET RV7bjlgdh $control__view="drift" $control__workList.0="H9TnltXVB";',
        'SET BjqrvIntTRV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB";',
        'SET nyI5jW7lARV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB";',
    ].join(" "),
    { pagePath: "/" }
)

const out = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(out, { recursive: true })
const shots = {}
for (const [id, name] of [
    ["BjqrvIntT", "cq-tablet.png"],
    ["nyI5jW7lA", "cq-phone.png"],
    ["augiA20Il", "cq-desktop.png"],
]) {
    try {
        const r = await framer.screenshot(id, { format: "png", scale: 1 })
        fs.writeFileSync(path.join(out, name), r.data)
        shots[name] = r.data.length
    } catch (e) {
        shots[name] = String(e)
    }
}

const check = {}
for (const id of [
    "RV7bjlgdh",
    "BjqrvIntTRV7bjlgdh",
    "nyI5jW7lARV7bjlgdh",
]) {
    const n = await framer.agent.getNode({ id }, { pagePath: "/" })
    const a = n?.attributes || {}
    check[id] = {
        view: a.$control__view,
        w: a.width,
        h: a.height,
        list: a.$control__workList,
    }
}
console.log(JSON.stringify({ applied, shots, check }, null, 2))

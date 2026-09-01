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
    ["BjqrvIntT", "tablet-meta.jpg"],
    ["nyI5jW7lA", "phone-meta.jpg"],
    ["WQLkyLRf1", "desktop-meta.jpg"],
]) {
    const r = await framer.screenshot(id, { format: "jpeg", scale: 2 })
    fs.writeFileSync(path.join(out, name), r.data)
    shots[name] = r.data.length
}
console.log(JSON.stringify({ project: info.name, applied, shots }))

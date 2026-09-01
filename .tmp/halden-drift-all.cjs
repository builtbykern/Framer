const fs = require("fs")
const path = require("path")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`expected Halden, got ${info.name}`)

const applied = await framer.agent.applyChanges(
    [
        'SET RV7bjlgdh $control__view="drift" $control__workList.0="H9TnltXVB";',
        'SET BjqrvIntTRV7bjlgdh $control__view="drift" $control__workList.0="H9TnltXVB" height="100%";',
        'SET nyI5jW7lARV7bjlgdh $control__view="drift" $control__workList.0="H9TnltXVB" height="100%";',
    ].join(" "),
    { pagePath: "/" }
)

const nodes = await framer.agent.serializeNodes(
    {
        ids: [
            "RV7bjlgdh",
            "BjqrvIntTRV7bjlgdh",
            "nyI5jW7lARV7bjlgdh",
        ],
        depth: 0,
        attributeFilter: [
            "$control__view",
            "$control__workList",
            "width",
            "height",
        ],
    },
    { pagePath: "/" }
)

const out = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(out, { recursive: true })
const shots = {}
for (const [id, name] of [
    ["WQLkyLRf1", "drift-all-desktop.jpg"],
    ["BjqrvIntT", "drift-all-tablet.jpg"],
    ["nyI5jW7lA", "drift-all-phone.jpg"],
]) {
    const r = await framer.screenshot(id, { format: "jpeg", scale: 1 })
    fs.writeFileSync(path.join(out, name), r.data)
    shots[name] = r.data.length
}

let vekter = null
try {
    vekter = await framer.agent.readProject(
        [
            { type: "screenshot", id: "WQLkyLRf1" },
            { type: "screenshot", id: "BjqrvIntT" },
            { type: "screenshot", id: "nyI5jW7lA" },
        ],
        { pagePath: "/" }
    )
} catch (e) {
    vekter = { error: String(e) }
}

console.log(
    JSON.stringify(
        { project: info.name, applied, nodes, shots, vekter },
        null,
        2
    )
)

const fs = require("fs")
const path = require("path")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const code = fs.readFileSync(
    path.join("/Users/noel/Desktop/Framer/.tmp/halden-src/Drift_Plane.tsx"),
    "utf8"
)
const files = await framer.getCodeFiles()
const file = files.find(
    (f) => f.name === "Drift_Plane.tsx" || (f.path && f.path.endsWith("Drift_Plane.tsx"))
)
if (!file) throw new Error("missing Drift_Plane.tsx")
const updated = await file.setFileContent(code)
const typeErrors = await updated.typecheck({ strict: true })
const applied = await framer.agent.applyChanges(
    [
        'SET RV7bjlgdh $control__view="drift" $control__workList.0="H9TnltXVB";',
        'SET BjqrvIntTRV7bjlgdh $control__view="drift" $control__workList.0="H9TnltXVB" height="100%";',
        'SET nyI5jW7lARV7bjlgdh $control__view="drift" $control__workList.0="H9TnltXVB" height="100%";',
    ].join(" "),
    { pagePath: "/" }
)
const out = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(out, { recursive: true })
const shots = {}
for (const [id, name] of [
    ["WQLkyLRf1", "slim-desktop.jpg"],
    ["BjqrvIntT", "slim-tablet.jpg"],
    ["nyI5jW7lA", "slim-phone.jpg"],
]) {
    const r = await framer.screenshot(id, { format: "jpeg", scale: 1 })
    fs.writeFileSync(path.join(out, name), r.data)
    shots[name] = r.data.length
}
console.log(
    JSON.stringify(
        {
            project: info.name,
            bytes: code.length,
            typeErrors,
            applied,
            shots,
        },
        null,
        2
    )
)

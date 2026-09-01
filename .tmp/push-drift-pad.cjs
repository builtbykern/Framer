const fs = require("fs")
const path = require("path")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const files = await framer.getCodeFiles()
const already = files.find((f) => f.name === "Drift_Plane.tsx")
if (!already) throw new Error("missing Drift_Plane")
const code = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Drift_Plane.tsx",
    "utf8"
)
if (!code.includes("max(72px, var(--chrome-pad-top")) {
    throw new Error("missing pad floor")
}
const file = await already.setFileContent(code)
const typeErrors = await file.typecheck({ strict: true })
const applied = await framer.agent.applyChanges(
    [
        'SET RV7bjlgdh $control__view="drift" $control__workList.0="H9TnltXVB";',
        'SET BjqrvIntTRV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB" $control__padTop="72";',
        'SET nyI5jW7lARV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB";',
    ].join(" "),
    { pagePath: "/" }
)
const out = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(out, { recursive: true })
const shots = {}
for (const [id, name] of [
    ["BjqrvIntT", "tablet-pad.jpg"],
    ["nyI5jW7lA", "phone-pad.jpg"],
]) {
    const r = await framer.screenshot(id, { format: "jpeg", scale: 2 })
    fs.writeFileSync(path.join(out, name), r.data)
    shots[name] = r.data.length
}
console.log(JSON.stringify({ id: file.id, typeErrors, applied, shots }))

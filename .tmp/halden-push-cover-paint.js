const fs = require("fs")
const path = require("path")
const dir = "/Users/noel/Desktop/Framer/.tmp/halden-src"
const out = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const drift = await framer.getCodeFile("Drift_Plane.tsx")
if (!drift) throw new Error("missing Drift_Plane")
const src = fs.readFileSync(`${dir}/Drift_Plane.tsx`, "utf8")
if (!src.includes("background-image: var(--variable-KF94WDLfr)")) {
    throw new Error("cover background-image missing")
}
await drift.setFileContent(src)
const driftTc = await (
    await framer.getCodeFile("Drift_Plane.tsx")
).typecheck({ strict: true })
await framer.agent.applyChanges(
    [
        'SET RV7bjlgdh $control__view="drift" $control__workList.0="H9TnltXVB";',
        'SET BjqrvIntTRV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB";',
        'SET nyI5jW7lARV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB";',
    ].join(" "),
    { pagePath: "/" }
)
fs.mkdirSync(out, { recursive: true })
const shots = {}
for (const [id, name] of [
    ["BjqrvIntT", "tablet-cover-paint.jpg"],
    ["nyI5jW7lA", "phone-cover-paint.jpg"],
]) {
    const r = await framer.screenshot(id, {
        format: "jpeg",
        scale: 2,
        quality: 85,
    })
    fs.writeFileSync(path.join(out, name), r.data)
    shots[name] = r.data.length
}
console.log(JSON.stringify({ project: info.name, driftTc, shots }, null, 2))

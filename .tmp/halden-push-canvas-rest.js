const fs = require("fs")
const path = require("path")
const dir = "/Users/noel/Desktop/Framer/.tmp/halden-src"
const out = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)
const drift = await framer.getCodeFile("Drift_Plane.tsx")
if (!drift) throw new Error("missing Drift_Plane")
const src = fs.readFileSync(`${dir}/Drift_Plane.tsx`, "utf8")
if (!src.includes("function nodeLayoutSize")) throw new Error("nodeLayoutSize missing")
if (!src.includes("idleEngaged")) throw new Error("idleEngaged missing")
if (src.includes('minHeight: "100vh"')) throw new Error("100vh minHeight still on drift")
await drift.setFileContent(src)
const live = await framer.getCodeFile("Drift_Plane.tsx")
const driftTc = await live.typecheck({ strict: true })
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
    ["WQLkyLRf1", "desktop-rest.png"],
    ["BjqrvIntT", "tablet-rest.png"],
    ["nyI5jW7lA", "phone-rest.png"],
]) {
    try {
        const r = await framer.screenshot(id, { format: "png", scale: 1 })
        fs.writeFileSync(path.join(out, name), r.data)
        shots[name] = r.data.length
    } catch (e) {
        shots[name] = String(e)
    }
}
console.log(JSON.stringify({ project: info.name, driftTc, shots }, null, 2))

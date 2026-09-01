const fs = require("fs")
const path = require("path")
const dir = "/Users/noel/Desktop/Framer/.tmp/halden-src"
const out = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)
const stills = await framer.getCodeFile("Series_Stills.tsx")
const drift = await framer.getCodeFile("Drift_Plane.tsx")
if (!stills || !drift) throw new Error("missing code files")
const driftSrc = fs.readFileSync(`${dir}/Drift_Plane.tsx`, "utf8")
const stillsSrc = fs.readFileSync(`${dir}/Series_Stills.tsx`, "utf8")
if (!driftSrc.includes("function freezeScatterCss")) {
    throw new Error("freezeScatterCss missing")
}
if (!stillsSrc.includes("preferPaint={inCollection || freeze}")) {
    throw new Error("preferPaint freeze missing")
}
await stills.setFileContent(stillsSrc)
await drift.setFileContent(driftSrc)
const stillsTc = await (
    await framer.getCodeFile("Series_Stills.tsx")
).typecheck({ strict: true })
const driftLive = await framer.getCodeFile("Drift_Plane.tsx")
const driftTc = await driftLive.typecheck({ strict: true })
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
    ["WQLkyLRf1", "desktop-canvas-now.png"],
    ["BjqrvIntT", "tablet-canvas-now.png"],
    ["nyI5jW7lA", "phone-canvas-now.png"],
]) {
    try {
        const r = await framer.screenshot(id, { format: "png", scale: 1 })
        fs.writeFileSync(path.join(out, name), r.data)
        shots[name] = r.data.length
    } catch (e) {
        shots[name] = String(e)
    }
}
console.log(
    JSON.stringify({ project: info.name, stillsTc, driftTc, shots }, null, 2)
)

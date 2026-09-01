const fs = require("fs")
const path = require("path")

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const sourceDir = "/Users/noel/Desktop/Framer/.tmp/halden-src"
const driftSrc = fs.readFileSync(`${sourceDir}/Drift_Plane.tsx`, "utf8")
const veilSrc = fs.readFileSync(`${sourceDir}/Page_Veil.tsx`, "utf8")

if (driftSrc.includes("openCardLink")) {
    throw new Error("Synthetic Drift navigation is still present")
}
if (!driftSrc.includes("event.currentTarget.setPointerCapture")) {
    throw new Error("Drag-threshold pointer capture is missing")
}
if (driftSrc.includes("onPointerDownCapture")) {
    throw new Error("Pointer capture still blocks native links")
}

const drift = await framer.getCodeFile("Drift_Plane.tsx")
const veil = await framer.getCodeFile("Page_Veil.tsx")
const updatedDrift = await drift.setFileContent(driftSrc)
const updatedVeil = await veil.setFileContent(veilSrc)
const driftTypes = await updatedDrift.typecheck({ strict: true })
const veilTypes = await updatedVeil.typecheck({ strict: true })

const bind = await framer.agent.applyChanges(
    [
        'SET RV7bjlgdh $control__workList.0="xmBenkfAk";',
        'SET BjqrvIntTRV7bjlgdh $control__workList.0="xmBenkfAk";',
        'SET nyI5jW7lARV7bjlgdh $control__workList.0="xmBenkfAk";',
    ].join(" "),
    { pagePath: "/" }
)

const outputDir = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(outputDir, { recursive: true })
const shots = {}
for (const [id, name] of [
    ["WQLkyLRf1", "native-links-desktop.jpg"],
    ["BjqrvIntT", "native-links-tablet.jpg"],
    ["nyI5jW7lA", "native-links-phone.jpg"],
]) {
    const result = await framer.screenshot(id, { format: "jpeg", scale: 1 })
    fs.writeFileSync(path.join(outputDir, name), result.data)
    shots[name] = result.data.length
}

console.log(
    JSON.stringify({ driftTypes, veilTypes, bind, shots }, null, 2).slice(
        0,
        8000
    )
)

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
if (!code.includes("APPEAR_SCALE_DUR = 1.8")) {
    throw new Error("appear timings not restored")
}
if (!code.includes("playIntro = !freezeAll && !prefersReduced && appearOn")) {
    throw new Error("appear gate not restored")
}
if (!code.includes('data-driftplane-mode="drift"')) {
    throw new Error("drift mode attr missing")
}
if (!code.includes("scale: 1.4")) {
    throw new Error("stage scale not restored")
}
const file = await already.setFileContent(code)
const typeErrors = await file.typecheck({ strict: true })
const applied = await framer.agent.applyChanges(
    [
        'MOVE nt9Gs3MMs parent="gSGwySyKV" index="0";',
        'SET nt9Gs3MMs position="absolute" top="0px" left="0px" width="100%" height="100%";',
        'SET gSGwySyKV gap="0px";',
        'SET RV7bjlgdh $control__view="drift" $control__workList.0="H9TnltXVB";',
        'SET BjqrvIntTRV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB";',
        'SET nyI5jW7lARV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB";',
    ].join(" "),
    { pagePath: "/" }
)
const out = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(out, { recursive: true })
const r = await framer.screenshot("WQLkyLRf1", { format: "jpeg", scale: 2 })
fs.writeFileSync(path.join(out, "desktop-drift-restored.jpg"), r.data)
console.log(
    JSON.stringify({
        project: info.name,
        id: file.id,
        typeErrors,
        applied,
        bytes: r.data.length,
    })
)

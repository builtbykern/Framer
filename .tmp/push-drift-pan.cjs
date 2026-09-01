const fs = require("fs")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const drift = await framer.getCodeFile("Drift_Plane.tsx")
const src = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Drift_Plane.tsx",
    "utf8"
)
if (!src.includes("onPointerDownCapture")) {
    throw new Error("missing pointer capture")
}
if (!src.includes("window.addEventListener(\"pointermove\"")) {
    throw new Error("missing window pointermove")
}
if (!src.includes("gap: 0 !important")) {
    throw new Error("work card gap not reverted")
}
if (src.includes("min-height: 320px")) {
    throw new Error("320 cover min still in CSS")
}
if (!src.includes("drift-cover-in")) {
    throw new Error("missing cover appear")
}
const file = await drift.setFileContent(src)
const typeErrors = await file.typecheck({ strict: true })
const applied = await framer.agent.applyChanges(
    [
        'SET RV7bjlgdh $control__view="drift" $control__workList.0="H9TnltXVB";',
        'SET BjqrvIntTRV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB";',
        'SET nyI5jW7lARV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB";',
        'SET gSGwySyKV gap="0px";',
    ].join(" "),
    { pagePath: "/" }
)
console.log(JSON.stringify({ project: info.name, id: file.id, typeErrors, applied }))

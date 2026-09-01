const fs = require("fs")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const files = await framer.getCodeFiles()
if (!files?.length) throw new Error("no code files")
const drift = await framer.getCodeFile("Drift_Plane.tsx")
const src = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Drift_Plane.tsx",
    "utf8"
)
if (!src.includes('COLLECTION_VEIL_BLUR = "blur(4px)"')) {
    throw new Error("enter veil was retuned — abort")
}
if (!src.includes("padding-right")) {
    throw new Error("missing freeze gutter padding")
}
if (!src.includes("function unwrapCollectionList")) {
    throw new Error("missing unwrapCollectionList")
}
const file = await drift.setFileContent(src)
const typeErrors = await file.typecheck({ strict: true })
const applied = await framer.agent.applyChanges(
    [
        'SET RV7bjlgdh $control__view="drift" $control__workList.0="H9TnltXVB";',
        'SET BjqrvIntTRV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB";',
        'SET nyI5jW7lARV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB";',
    ].join(" "),
    { pagePath: "/" }
)
console.log(JSON.stringify({ project: info.name, id: file.id, typeErrors, applied }))

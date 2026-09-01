const fs = require("fs")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const drift = await framer.getCodeFile("Drift_Plane.tsx")
const src = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Drift_Plane.tsx",
    "utf8"
)
if (!src.includes('COLLECTION_VEIL_BLUR = "blur(4px)"')) {
    throw new Error("blur not reduced")
}
if (src.includes('node.dataset.collectionIn = "0"')) {
    throw new Error("bind still forces in=0 (would animate on-screen tiles)")
}
if (!src.includes('rootMargin: "0px 12px 0px 12px"')) {
    throw new Error("missing approach margin")
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
console.log(JSON.stringify({ project: info.name, typeErrors, applied }))

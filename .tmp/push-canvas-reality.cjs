const fs = require("fs")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const files = await framer.getCodeFiles()
if (!files?.length) throw new Error("no code files")

const driftSrc = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Drift_Plane.tsx",
    "utf8"
)
const stillsSrc = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Series_Stills.tsx",
    "utf8"
)
if (!driftSrc.includes('COLLECTION_VEIL_BLUR = "blur(4px)"')) {
    throw new Error("enter veil was retuned — abort")
}
if (driftSrc.includes("freezeAll ? 0 : collectionGap")) {
    throw new Error("canvas gap still zeroed")
}
if (!driftSrc.includes('height: freezeAll ? "auto" : "100%"')) {
    throw new Error("missing freeze auto height")
}
if (!stillsSrc.includes("stackedStills")) {
    throw new Error("missing stills canvas fallback")
}

const drift = await framer.getCodeFile("Drift_Plane.tsx")
const stills = await framer.getCodeFile("Series_Stills.tsx")
const driftFile = await drift.setFileContent(driftSrc)
const stillsFile = await stills.setFileContent(stillsSrc)
const typeErrors = [
    ...(await driftFile.typecheck({ strict: true })),
    ...(await stillsFile.typecheck({ strict: true })),
]
const applied = await framer.agent.applyChanges(
    [
        'SET RV7bjlgdh $control__view="drift" $control__workList.0="H9TnltXVB";',
        'SET BjqrvIntTRV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB" height="auto";',
        'SET nyI5jW7lARV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB" height="auto";',
        'SET yGFlVus2I $control__cover="var(--variable-KF94WDLfr)";',
    ].join(" "),
    { pagePath: "/" }
)
console.log(JSON.stringify({ project: info.name, typeErrors, applied }))

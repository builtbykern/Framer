const fs = require("fs")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const drift = await framer.getCodeFile("Drift_Plane.tsx")
const src = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Drift_Plane.tsx",
    "utf8"
)
if (!src.includes("idleEngaged = useRef(true)")) {
    throw new Error("idle not restored")
}
if (!src.includes("const useSnapMode = false")) {
    throw new Error("snap still width-gated")
}
if (src.includes("Idle crawl only after the user moves")) {
    throw new Error("old idle comment still present")
}
if (!src.includes('cover.style.setProperty("height", "320px"')) {
    throw new Error("cover 320 bind missing")
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

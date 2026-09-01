const fs = require("fs")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const stills = await framer.getCodeFile("Series_Stills.tsx")
const src = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Series_Stills.tsx",
    "utf8"
)
if (!src.includes("stackedStills")) throw new Error("missing stills fallback")
const file = await stills.setFileContent(src)
const typeErrors = await file.typecheck({ strict: true })
const applied = await framer.agent.applyChanges(
    [
        'SET RV7bjlgdh $control__view="drift" $control__workList.0="H9TnltXVB";',
        'SET BjqrvIntTRV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB" height="auto";',
        'SET nyI5jW7lARV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB" height="auto";',
        'SET yGFlVus2I $control__cover="var(--variable-KF94WDLfr)";',
    ].join(" "),
    { pagePath: "/" }
)
const t = await framer.agent.getNode({ id: "BjqrvIntTRV7bjlgdh" }, { pagePath: "/" })
const p = await framer.agent.getNode({ id: "nyI5jW7lARV7bjlgdh" }, { pagePath: "/" })
console.log(JSON.stringify({
    id: file.id,
    typeErrors,
    applied,
    heights: {
        tablet: t?.attributes?.height,
        phone: p?.attributes?.height,
        tView: t?.attributes?.$control__view,
        pView: p?.attributes?.$control__view,
    },
}))

const fs = require("fs")
const dir = "/Users/noel/Desktop/Framer/.tmp/halden-src"
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const stills = await framer.getCodeFile("Series_Stills.tsx")
const drift = await framer.getCodeFile("Drift_Plane.tsx")
if (!stills || !drift) throw new Error("missing code files")
const driftSrc = fs.readFileSync(`${dir}/Drift_Plane.tsx`, "utf8")
if (!driftSrc.includes("const layerFar")) throw new Error("missing layerFar")
if (driftSrc.includes("&& appearEnabled")) throw new Error("appear still gates intro")
await stills.setFileContent(fs.readFileSync(`${dir}/Series_Stills.tsx`, "utf8"))
await drift.setFileContent(driftSrc)
const stillsTc = (await framer.getCodeFile("Series_Stills.tsx")).typecheck({ strict: true })
const driftLive = await framer.getCodeFile("Drift_Plane.tsx")
const driftTc = await driftLive.typecheck({ strict: true })
const keep = await framer.agent.applyChanges(
    [
        'SET RV7bjlgdh $control__view="drift" $control__workList.0="H9TnltXVB";',
        'SET BjqrvIntTRV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB";',
        'SET nyI5jW7lARV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB";',
    ].join(" "),
    { pagePath: "/" }
)
console.log(JSON.stringify({
    project: info.name,
    stillsTc,
    driftTc,
    gated: String(driftLive.content).includes("&& appearEnabled"),
    errors: keep.errors,
}, null, 2))

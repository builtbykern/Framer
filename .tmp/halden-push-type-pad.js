const fs = require("fs")
const path = require("path")
const dir = "/Users/noel/Desktop/Framer/.tmp/halden-src"
const out = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const stills = await framer.getCodeFile("Series_Stills.tsx")
const drift = await framer.getCodeFile("Drift_Plane.tsx")
if (!stills || !drift) throw new Error("missing code files")

const stillsSrc = fs.readFileSync(`${dir}/Series_Stills.tsx`, "utf8")
const driftSrc = fs.readFileSync(`${dir}/Drift_Plane.tsx`, "utf8")
if (!stillsSrc.includes('alignSelf: "flex-start"')) {
    throw new Error("collection prints not left")
}
if (!driftSrc.includes("ControlType.Font")) throw new Error("missing Font controls")
if (!driftSrc.includes("padTop")) throw new Error("missing padTop")
if (!driftSrc.includes("titleFontCss")) throw new Error("missing title font css")

await stills.setFileContent(stillsSrc)
await drift.setFileContent(driftSrc)
const stillsLive = await framer.getCodeFile("Series_Stills.tsx")
const driftLive = await framer.getCodeFile("Drift_Plane.tsx")
const stillsTc = await stillsLive.typecheck({ strict: true })
const driftTc = await driftLive.typecheck({ strict: true })

const applied = await framer.agent.applyChanges(
    [
        'SET RV7bjlgdh $control__view="drift" $control__workList.0="H9TnltXVB";',
        'SET BjqrvIntTRV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB" height="100%";',
        'SET nyI5jW7lARV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB" height="100%";',
    ].join(" "),
    { pagePath: "/" }
)

fs.mkdirSync(out, { recursive: true })
let shot = null
try {
    const r = await framer.screenshot("BjqrvIntT", { format: "png", scale: 1 })
    fs.writeFileSync(path.join(out, "collection-left-type.png"), r.data)
    shot = r.data.length
} catch (e) {
    shot = String(e)
}

console.log(
    JSON.stringify(
        {
            project: info.name,
            stillsTc,
            driftTc,
            font: String(driftLive.content).includes("ControlType.Font"),
            errors: applied.errors,
            parseErrors: applied.parseErrors,
            shot,
        },
        null,
        2
    )
)

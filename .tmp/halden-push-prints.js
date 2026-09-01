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
if (!stillsSrc.includes("COLLECTION_PRINTS")) {
    throw new Error("local stills missing COLLECTION_PRINTS")
}
if (stillsSrc.includes('"48%"')) throw new Error("48% print still present")
if (!driftSrc.includes("margin-left: auto")) {
    throw new Error("local drift missing flush margin")
}

await stills.setFileContent(stillsSrc)
await drift.setFileContent(driftSrc)
const stillsLive = await framer.getCodeFile("Series_Stills.tsx")
const driftLive = await framer.getCodeFile("Drift_Plane.tsx")
const stillsTc = await stillsLive.typecheck({ strict: true })
const driftTc = await driftLive.typecheck({ strict: true })

const applied = await framer.agent.applyChanges(
    [
        'SET RV7bjlgdh $control__view="drift" $control__workList.0="H9TnltXVB";',
        'SET BjqrvIntTRV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB" height="auto";',
        'SET nyI5jW7lARV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB" height="auto";',
    ].join(" "),
    { pagePath: "/" }
)

fs.mkdirSync(out, { recursive: true })
let shot = null
try {
    const r = await framer.screenshot("BjqrvIntT", { format: "png", scale: 1 })
    fs.writeFileSync(path.join(out, "collection-prints.png"), r.data)
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
            prints: String(stillsLive.content).includes("COLLECTION_PRINTS"),
            clusterGrid: String(driftLive.content).includes("1fr 1fr"),
            errors: applied.errors,
            shot,
        },
        null,
        2
    )
)

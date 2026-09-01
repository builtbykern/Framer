const fs = require("fs")
const dir = "/Users/noel/Desktop/Framer/.tmp/halden-src"

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const files = await framer.getCodeFiles()
const series = files.find((f) => f.id === "jeA2cvO")
const drift = files.find((f) => f.id === "Og5966a")
if (!series || !drift) throw new Error("missing code files")

await series.setFileContent(fs.readFileSync(`${dir}/Series_Stills.tsx`, "utf8"))
const seriesTc = await series.typecheck()

await drift.setFileContent(fs.readFileSync(`${dir}/Drift_Plane.tsx`, "utf8"))
const driftTc = await drift.typecheck()

const rebind = await framer.agent.applyChanges(
    [
        'SET RV7bjlgdh $control__view="drift" $control__workList.0="H9TnltXVB";',
        'SET BjqrvIntTRV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB" height="100%";',
        'SET nyI5jW7lARV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB" height="100%";',
        'SET yGFlVus2I $control__cover="var(--variable-KF94WDLfr)";',
    ].join(" "),
    { pagePath: "/" }
)

console.log(
    JSON.stringify(
        {
            project: info.name,
            seriesTc,
            driftTc,
            rebindErrors: rebind.errors,
            rebindWarnings: rebind.warnings,
        },
        null,
        2
    )
)

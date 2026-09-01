const fs = require("fs")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const stills = await framer.getCodeFile("Series_Stills.tsx")
const drift = await framer.getCodeFile("Drift_Plane.tsx")
if (!stills || !drift) throw new Error("missing code files")

const stillsSrc = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Series_Stills.tsx",
    "utf8"
)
const driftSrc = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Drift_Plane.tsx",
    "utf8"
)
if (!stillsSrc.includes("preferPaint")) throw new Error("local stills missing preferPaint")
if (!driftSrc.includes("paintCollectionStills")) {
    throw new Error("local drift missing paintCollectionStills")
}
if (driftSrc.includes("-webkit-line-clamp: 2")) {
    throw new Error("title still clamped")
}

await stills.setFileContent(stillsSrc)
await drift.setFileContent(driftSrc)
const stillsLive = await framer.getCodeFile("Series_Stills.tsx")
const driftLive = await framer.getCodeFile("Drift_Plane.tsx")
const stillsTc = await stillsLive.typecheck({ strict: true })
const driftTc = await driftLive.typecheck({ strict: true })

const applied = await framer.agent.applyChanges(
    [
        'SET yGFlVus2I $control__cover="var(--variable-KF94WDLfr)";',
        'SET GAokM9PPJ text="var(--variable-lmTMqy_0B)" textTruncation="2";',
        'SET RV7bjlgdh $control__view="drift" $control__workList.0="H9TnltXVB";',
        'SET BjqrvIntTRV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB" height="auto";',
        'SET nyI5jW7lARV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB" height="auto";',
    ].join(" "),
    { pagePath: "/" }
)

console.log(
    JSON.stringify(
        {
            project: info.name,
            stillsTc,
            driftTc,
            preferPaint: String(stillsLive.content).includes("preferPaint"),
            paintFn: String(driftLive.content).includes("paintCollectionStills"),
            errors: applied.errors,
            parseErrors: applied.parseErrors,
        },
        null,
        2
    )
)

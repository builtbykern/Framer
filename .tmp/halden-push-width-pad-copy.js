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
if (driftSrc.includes("columnWidth")) throw new Error("local still has columnWidth")
if (stillsSrc.includes("COLLECTION_PRINTS")) {
    throw new Error("local still has COLLECTION_PRINTS")
}

await stills.setFileContent(stillsSrc)
await drift.setFileContent(driftSrc)

const stillsLive = await framer.getCodeFile("Series_Stills.tsx")
const driftLive = await framer.getCodeFile("Drift_Plane.tsx")
const stillsTc = await stillsLive.typecheck({ strict: true })
const driftTc = await driftLive.typecheck({ strict: true })

const applied = await framer.agent.applyChanges(
    [
        'SET FddpNYFNF text="var(--variable-blc_46opK)" width="100%";',
        'SET KSgxSNQ22 visible="false";',
        'SET RV7bjlgdh $control__view="drift" $control__workList.0="H9TnltXVB";',
        'SET BjqrvIntTRV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB" height="auto";',
        'SET nyI5jW7lARV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB" height="auto";',
    ].join(" "),
    { pagePath: "/" }
)

const typeNode = await framer.agent.serializeNodes(
    { ids: ["FddpNYFNF", "KSgxSNQ22", "GAokM9PPJ"], depth: 0 },
    { pagePath: "/" }
)

console.log(
    JSON.stringify(
        {
            project: info.name,
            stillsTc,
            driftTc,
            stillsNoPrints: !String(stillsLive.content).includes("COLLECTION_PRINTS"),
            driftNoWidth: !String(driftLive.content).includes("columnWidth"),
            driftFig100: String(driftLive.content).includes(
                "width: 100% !important;\n    max-width: 100% !important;\n    align-self: stretch"
            ),
            errors: applied.errors,
            parseErrors: applied.parseErrors,
            typeText: typeNode?.[0]?.attributes?.text,
            descVisible: typeNode?.[1]?.attributes?.visible,
            titleText: typeNode?.[2]?.attributes?.text,
        },
        null,
        2
    )
)

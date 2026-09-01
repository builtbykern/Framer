const fs = require("fs")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const files = await framer.getCodeFiles()
const drift =
    files.find((f) => f.id === "Og5966a" || f.name === "Drift_Plane.tsx") ||
    (await framer.getCodeFile("Drift_Plane.tsx")) ||
    (await framer.getCodeFile("Og5966a"))
if (!drift) {
    console.log(
        JSON.stringify({
            project: info.name,
            fileCount: files.length,
            names: files.map((f) => f.name),
        })
    )
    throw new Error("missing Drift_Plane")
}

const src = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Drift_Plane.tsx",
    "utf8"
)
if (!src.includes("columnWidth") || !src.includes("collectionNudgeDone")) {
    throw new Error("local Drift_Plane missing width/nudge")
}

await drift.setFileContent(src)
const driftTc = await drift.typecheck()
const live = await framer.getCodeFile(drift.id || "Drift_Plane.tsx")
const content = typeof live?.content === "string" ? live.content : drift.content

const rebind = await framer.agent.applyChanges(
    [
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
            id: drift.id,
            driftTc,
            hasWidth: typeof content === "string" && content.includes("columnWidth"),
            hasNudge:
                typeof content === "string" &&
                content.includes("collectionNudgeDone"),
            errors: rebind.errors,
        },
        null,
        2
    )
)

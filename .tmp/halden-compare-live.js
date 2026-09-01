const fs = require("fs")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const stills = await framer.getCodeFile("Series_Stills.tsx")
if (!stills) throw new Error("missing Series_Stills.tsx")
const drift = await framer.getCodeFile("Drift_Plane.tsx")
if (!drift) throw new Error("missing Drift_Plane.tsx")

function flags(c) {
    const s = String(c || "")
    return {
        bytes: s.length,
        padIndex: s.includes("function padIndex"),
        unwrap: s.includes("function unwrapControlValue"),
        nudge: s.includes("collectionNudgeDone"),
        columnWidth: s.includes("columnWidth"),
        stillGutter: s.includes("stillGutter"),
    }
}

console.log(
    JSON.stringify(
        {
            project: info.name,
            stills: { id: stills.id, ...flags(stills.content) },
            drift: { id: drift.id, ...flags(drift.content) },
            localStills: flags(
                fs.readFileSync(
                    "/Users/noel/Desktop/Framer/.tmp/halden-src/Series_Stills.tsx",
                    "utf8"
                )
            ),
            localDrift: flags(
                fs.readFileSync(
                    "/Users/noel/Desktop/Framer/.tmp/halden-src/Drift_Plane.tsx",
                    "utf8"
                )
            ),
        },
        null,
        2
    )
)

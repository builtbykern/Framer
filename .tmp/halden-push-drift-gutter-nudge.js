const fs = require("fs")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const file = await framer.getCodeFile("Drift_Plane.tsx")
if (!file) throw new Error("missing Drift_Plane.tsx")
const src = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Drift_Plane.tsx",
    "utf8"
)
if (!src.includes("function unwrapControlValue")) {
    throw new Error("local missing unwrap")
}
if (!src.includes("collectionNudgeDone")) throw new Error("local missing nudge")
if (!src.includes("columnWidth")) throw new Error("local missing Width")

await file.setFileContent(src)
const updated = await framer.getCodeFile("Drift_Plane.tsx")
const typeErrors = await updated.typecheck({ strict: true })
const live = String(updated.content || "")
console.log(
    JSON.stringify(
        {
            project: info.name,
            id: updated.id,
            bytes: live.length,
            unwrap: live.includes("function unwrapControlValue"),
            nudge: live.includes("collectionNudgeDone"),
            columnWidth: live.includes("columnWidth"),
            stillGutter: live.includes("stillGutter"),
            typeErrors,
        },
        null,
        2
    )
)

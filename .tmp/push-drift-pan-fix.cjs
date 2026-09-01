const fs = require("fs")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const drift = await framer.getCodeFile("Drift_Plane.tsx")
const src = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Drift_Plane.tsx",
    "utf8"
)
if (!src.includes("suppressCollectionClick")) {
    throw new Error("collection click suppress missing")
}
if (!src.includes("suppressDriftClick")) {
    throw new Error("drift click suppress missing")
}
const file = await drift.setFileContent(src)
const typeErrors = await file.typecheck({ strict: true })
console.log(JSON.stringify({ id: file.id, typeErrors }))

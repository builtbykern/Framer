const fs = require("node:fs")

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const file = await framer.getCodeFile("Drift_Plane.tsx")
if (!file) throw new Error("Drift_Plane.tsx not found")

const source = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Drift_Plane.tsx",
    "utf8"
)
const updated = await file.setFileContent(source)
const typeErrors = await updated.typecheck({ strict: true })
if (typeErrors.length > 0) throw new Error(JSON.stringify(typeErrors))

console.log(JSON.stringify({ typeErrors }, null, 2))

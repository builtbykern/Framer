const fs = require("fs")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const drift = await framer.getCodeFile("Drift_Plane.tsx")
const src = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Drift_Plane.tsx",
    "utf8"
)
if (!src.includes("function fillDriftCover")) throw new Error("missing fill")
if (!src.includes("min-height: 320px")) throw new Error("missing 320")
const file = await drift.setFileContent(src)
const typeErrors = await file.typecheck({ strict: true })
console.log(JSON.stringify({ id: file.id, typeErrors }))

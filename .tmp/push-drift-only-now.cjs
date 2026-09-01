const fs = require("fs")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const files = await framer.getCodeFiles()
const drift = files.find((f) => f.name === "Drift_Plane.tsx")
if (!drift) throw new Error("missing Drift_Plane")
const code = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Drift_Plane.tsx",
    "utf8"
)
if (!code.includes("function fillDriftCover")) throw new Error("missing fill")
const file = await drift.setFileContent(code)
const typeErrors = await file.typecheck({ strict: true })
console.log(JSON.stringify({ id: file.id, typeErrors }))

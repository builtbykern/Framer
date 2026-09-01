const fs = require("fs")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const files = await framer.getCodeFiles()
const already = files.find((f) => f.name === "Drift_Plane.tsx")
if (!already) throw new Error("missing Drift_Plane")
const code = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Drift_Plane.tsx",
    "utf8"
)
if (!code.includes('[data-framer-name="Series Meta"] {\n    display: flex')) {
    throw new Error("Series Meta not flex")
}
const file = await already.setFileContent(code)
const typeErrors = await file.typecheck({ strict: true })
console.log(JSON.stringify({ id: file.id, bytes: code.length, typeErrors }))

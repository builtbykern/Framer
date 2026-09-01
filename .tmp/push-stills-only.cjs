const fs = require("fs")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const stills = await framer.getCodeFile("Series_Stills.tsx")
const src = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Series_Stills.tsx",
    "utf8"
)
if (!src.includes("const stacked = inCollection || freeze")) {
    throw new Error("missing stacked")
}
const file = await stills.setFileContent(src)
const typeErrors = await file.typecheck({ strict: true })
console.log(JSON.stringify({ id: file.id, typeErrors }))

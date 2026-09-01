const fs = require("fs")

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const src = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Page_Veil.tsx",
    "utf8"
)
if (!src.includes('router.navigate("fpoP3kuA4"')) {
    throw new Error("Missing Work router navigation")
}

const existing = await framer.getCodeFile("Page_Veil.tsx")
const updated = await existing.setFileContent(src)
const typeErrors = await updated.typecheck({ strict: true })

console.log(JSON.stringify({ typeErrors }, null, 2))

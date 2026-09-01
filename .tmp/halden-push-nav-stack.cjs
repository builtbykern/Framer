const fs = require("fs")

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const source = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Menu_Paper_Reveal.tsx",
    "utf8"
)
if (!source.includes("const VEIL_Z = 9")) {
    throw new Error("Expected Menu veil below Nav Bar")
}

const existing = await framer.getCodeFile("Menu_Paper_Reveal.tsx")
if (!existing) throw new Error("Menu_Paper_Reveal.tsx not found")

const updated = await existing.setFileContent(source)
const typeErrors = await updated.typecheck({ strict: true })
if (typeErrors.length > 0) {
    throw new Error(JSON.stringify(typeErrors))
}

console.log(JSON.stringify({ ok: true, typeErrors }, null, 2))

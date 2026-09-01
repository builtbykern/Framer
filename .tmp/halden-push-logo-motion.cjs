const fs = require("fs")

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const source = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Logo_Menu_Roll.tsx",
    "utf8"
)
if (!source.includes("const PRESS_SCALE = 0.98")) {
    throw new Error("Expected press feedback")
}

const existing = await framer.getCodeFile("Logo_Menu_Roll.tsx")
if (!existing) throw new Error("Logo_Menu_Roll.tsx not found")

const updated = await existing.setFileContent(source)
const typeErrors = await updated.typecheck({ strict: true })
if (typeErrors.length > 0) {
    throw new Error(JSON.stringify(typeErrors))
}
const wrapperAria = await framer.agent.applyChanges(
    "SET Gz9TsJWVA ariaLabel=null;\nSET lHV5aHgaZGz9TsJWVA ariaLabel=null;"
)

console.log(JSON.stringify({ ok: true, typeErrors, wrapperAria }, null, 2))

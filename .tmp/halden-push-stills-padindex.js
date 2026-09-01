const fs = require("fs")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const file = await framer.getCodeFile("Series_Stills.tsx")
if (!file) throw new Error("missing Series_Stills.tsx")
const src = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Series_Stills.tsx",
    "utf8"
)
if (!src.includes("function padIndex")) throw new Error("local missing padIndex")

await file.setFileContent(src)
const updated = await framer.getCodeFile("Series_Stills.tsx")
const typeErrors = await updated.typecheck({ strict: true })
const live = String(updated.content || "")
console.log(
    JSON.stringify(
        {
            project: info.name,
            id: updated.id,
            bytes: live.length,
            padIndex: live.includes("function padIndex"),
            typeErrors,
        },
        null,
        2
    )
)

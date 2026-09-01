const fs = require("fs")
const src = fs.readFileSync("/Users/noel/Desktop/Framer/.tmp/halden-src/Series_Stills.tsx", "utf8")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)
const files = await framer.getCodeFiles()
const stills =
    files.find((f) => f.name === "Series_Stills.tsx" || f.id === "jeA2cvO") ||
    (await framer.getCodeFile("Series_Stills.tsx"))
if (!stills) {
    console.log(
        JSON.stringify(
            {
                project: info.name,
                fileCount: files.length,
                names: files.map((f) => f.name),
            },
            null,
            2
        )
    )
    throw new Error("missing Series_Stills")
}
await stills.setFileContent(src)
const tc = await stills.typecheck()
console.log(
    JSON.stringify({ project: info.name, id: stills.id, tc }, null, 2)
)

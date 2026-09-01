const fs = require("fs")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const stills = await framer.getCodeFile("Series_Stills.tsx")
if (!stills) {
    const files = await framer.getCodeFiles()
    console.log(JSON.stringify({ files: files.map((f) => ({ id: f.id, name: f.name, path: f.path })) }))
    throw new Error("missing Series_Stills")
}

const src = fs.readFileSync("/Users/noel/Desktop/Framer/.tmp/halden-src/Series_Stills.tsx", "utf8")
if (!src.includes("function padIndex")) throw new Error("local file missing padIndex")

await stills.setFileContent(src)
const stillsTc = await stills.typecheck()
const live = await framer.getCodeFile("Series_Stills.tsx")
console.log(
    JSON.stringify(
        {
            project: info.name,
            id: stills.id,
            stillsTc,
            hasPadIndex:
                typeof live?.content === "string" &&
                live.content.includes("function padIndex"),
        },
        null,
        2
    )
)

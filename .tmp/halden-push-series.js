const fs = require("fs")
const path = "/Users/noel/Desktop/Framer/.tmp/halden-src/Series_Stills.tsx"

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const files = await framer.getCodeFiles()
const series = files.find((f) => f.id === "jeA2cvO")
if (!series) throw new Error("missing Series_Stills")

await series.setFileContent(fs.readFileSync(path, "utf8"))
const seriesTc = await series.typecheck()
console.log(JSON.stringify({ project: info.name, seriesTc }, null, 2))

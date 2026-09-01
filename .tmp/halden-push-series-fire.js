const fs = require("fs")
const path = "/Users/noel/Desktop/Framer/.tmp/halden-src/Series_Stills.tsx"
const code = fs.readFileSync(path, "utf8")

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const files = await framer.getCodeFiles()
const series = files.find((f) => f.id === "jeA2cvO")
if (!series) throw new Error("missing Series_Stills")

series.setFileContent(code)
console.log(JSON.stringify({ project: info.name, kicked: true, bytes: code.length }))

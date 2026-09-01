const fs = require("fs")
const path = require("path")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)
const out = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(out, { recursive: true })
try {
    const r = await framer.screenshot("BjqrvIntT", { format: "png", scale: 1 })
    fs.writeFileSync(path.join(out, "collection-craft.png"), r.data)
    console.log(JSON.stringify({ project: info.name, bytes: r.data.length }))
} catch (e) {
    console.log(JSON.stringify({ project: info.name, error: String(e) }))
}

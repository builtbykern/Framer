const fs = require("fs")
const path = require("path")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)
const out = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(out, { recursive: true })
try {
    const r = await framer.screenshot("H9TnltXVB", { format: "png", scale: 1 })
    fs.writeFileSync(path.join(out, "work-list.png"), r.data)
    console.log(JSON.stringify({ ok: true, bytes: r.data.length }))
} catch (e) {
    console.log(JSON.stringify({ ok: false, error: String(e) }))
}

const fs = require("fs")
const path = require("path")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const files = await framer.getCodeFiles()
const drift = files.find((f) => f.name === "Drift_Plane.tsx")
const c = String(drift?.content || "")
const out = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(out, { recursive: true })
let bytes = null
try {
    const r = await framer.screenshot("WQLkyLRf1", { format: "png", scale: 1 })
    fs.writeFileSync(path.join(out, "drift-full-wrap.png"), r.data)
    bytes = r.data.length
} catch (e) {
    bytes = String(e)
}
console.log(
    JSON.stringify(
        {
            project: info.name,
            n: files.length,
            fullWrap: c.includes("buildSlots(occupied, tile, unitScale)"),
            hides: c.includes("visibility = \"hidden\""),
            bytes,
        },
        null,
        2
    )
)

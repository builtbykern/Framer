const fs = require("fs")
const path = require("path")

const outDir = "/Users/noel/Desktop/Framer/.tmp"
const result = await framer.screenshot("WQLkyLRf1", {
  format: "png",
  scale: 1,
  clip: { x: 0, y: 0, width: 1200, height: 900 },
})

const out = path.join(outDir, "demo-desktop-top.png")
fs.writeFileSync(out, result.data)
console.log(JSON.stringify({ out, mimeType: result.mimeType, bytes: result.data.length }))

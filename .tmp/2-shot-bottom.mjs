const fs = require("fs")
const path = require("path")
const outDir = "/Users/noel/Desktop/Framer/.tmp"

// Top of page
const top = await framer.screenshot("WQLkyLRf1", {
  format: "png",
  scale: 1,
  clip: { x: 0, y: 0, width: 1200, height: 900 },
})
fs.writeFileSync(path.join(outDir, "demo-bottom-top.png"), top.data)

// Bottom of page — Soft veil region (approx end of content)
const rect = await framer.agent.getRect({ id: "WQLkyLRf1" })
const h = rect?.height ?? 2800
const clipY = Math.max(0, h - 900)
const bottom = await framer.screenshot("WQLkyLRf1", {
  format: "png",
  scale: 1,
  clip: { x: 0, y: clipY, width: 1200, height: 900 },
})
fs.writeFileSync(path.join(outDir, "demo-bottom-veil.png"), bottom.data)

console.log(JSON.stringify({ height: h, clipY, topBytes: top.data.length, bottomBytes: bottom.data.length }))

const review = await framer.agent.reviewChanges()
console.log("review", JSON.stringify({ status: review?.status, errors: review?.errors, warnings: review?.warnings }, null, 2).slice(0, 2000))

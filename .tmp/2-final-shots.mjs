const fs = require("fs")
const path = require("path")
const outDir = "/Users/noel/Desktop/Framer/.tmp"

const top = await framer.screenshot("WQLkyLRf1", {
  format: "png",
  scale: 1,
  clip: { x: 0, y: 0, width: 1200, height: 780 },
})
fs.writeFileSync(path.join(outDir, "demo-final-top.png"), top.data)

// Capture blur node alone — Soft bottom veil
const blurShot = await framer.screenshot("lpuQSsTX0", {
  format: "png",
  scale: 2,
})
fs.writeFileSync(path.join(outDir, "demo-final-blur.png"), blurShot.data)

const review = await framer.agent.reviewChanges()
const warnings = review?.warnings ?? {}
console.log(
  JSON.stringify(
    {
      topBytes: top.data.length,
      blurBytes: blurShot.data.length,
      contrast: warnings["Text contrast against its background is too low"]?.length ?? 0,
      warningKeys: Object.keys(warnings),
    },
    null,
    2
  )
)

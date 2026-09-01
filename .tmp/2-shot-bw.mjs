const fs = require("fs")
const path = require("path")
const outDir = "/Users/noel/Desktop/Framer/.tmp"

const top = await framer.screenshot("WQLkyLRf1", {
  format: "png",
  scale: 1,
  clip: { x: 0, y: 0, width: 1200, height: 900 },
})
fs.writeFileSync(path.join(outDir, "demo-bw-top.png"), top.data)

const rect = await framer.agent.getRect({ id: "WQLkyLRf1" })
const h = rect?.height ?? 2600
const midY = Math.min(900, Math.max(0, Math.floor(h * 0.35)))
const mid = await framer.screenshot("WQLkyLRf1", {
  format: "png",
  scale: 1,
  clip: { x: 0, y: midY, width: 1200, height: 900 },
})
fs.writeFileSync(path.join(outDir, "demo-bw-mid.png"), mid.data)

const review = await framer.agent.reviewChanges()
console.log(
  JSON.stringify(
    {
      height: h,
      topBytes: top.data.length,
      midBytes: mid.data.length,
      errors: review?.errors ?? null,
      warningKeys: Object.keys(review?.warnings ?? {}),
    },
    null,
    2
  )
)

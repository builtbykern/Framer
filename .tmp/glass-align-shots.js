const fs = require("fs")
const dir = "/Users/noel/Desktop/Framer/docs/projects/listings"
fs.mkdirSync(dir, { recursive: true })

await new Promise((r) => setTimeout(r, 2500))

const home = await framer.screenshot("WQLkyLRf1", { format: "png", scale: 1 })
fs.writeFileSync(`${dir}/Kern_GlassType_home.png`, home.data)
console.log("home", home.data.length)

const thumb = await framer.screenshot("LpZFimpa4", { format: "png", scale: 1 })
fs.writeFileSync(`${dir}/Kern_GlassType_thumbnail.png`, thumb.data)
console.log("thumb1600", thumb.data.length, "expect ~1600x1200")

const thumb2 = await framer.screenshot("LpZFimpa4", { format: "png", scale: 1.5 })
fs.writeFileSync(`${dir}/Kern_GlassType_thumbnail_2400.png`, thumb2.data)
console.log("thumb2400", thumb2.data.length)

const fs = require("fs")
const dir = "/Users/noel/Desktop/Framer/docs/projects/listings"

const home = await framer.screenshot("WQLkyLRf1", { format: "png", scale: 1 })
fs.writeFileSync(`${dir}/Kern_GlassType_home.png`, home.data)
console.log("home", home.data.length)

const thumb = await framer.screenshot("LpZFimpa4", { format: "png", scale: 1 })
fs.writeFileSync(`${dir}/Kern_GlassType_thumbnail.png`, thumb.data)
console.log("thumb", thumb.data.length)

const thumb2 = await framer.screenshot("LpZFimpa4", { format: "png", scale: 1.5 })
fs.writeFileSync(`${dir}/Kern_GlassType_thumbnail_2400.png`, thumb2.data)
console.log("thumb2x", thumb2.data.length)

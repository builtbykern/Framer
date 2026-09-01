const fs = require("fs")
const path = "/Users/noel/Desktop/Framer/docs/projects/listings"
fs.mkdirSync(path, { recursive: true })

const shot = await framer.screenshot("LpZFimpa4", { format: "png", scale: 1 })
fs.writeFileSync(`${path}/Kern_GlassType_thumbnail.png`, shot.data)
console.log("1600", shot.data.length)

const shot2 = await framer.screenshot("LpZFimpa4", { format: "png", scale: 1.5 })
fs.writeFileSync(`${path}/Kern_GlassType_thumbnail_2400.png`, shot2.data)
console.log("2400", shot2.data.length)

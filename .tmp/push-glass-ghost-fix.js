const fs = require("fs")
const code = fs.readFileSync(
    "/Users/noel/Desktop/Framer/state/BuiltByKern_GlassType.tsx",
    "utf8"
)
const files = await framer.getCodeFiles()
const file = files.find((f) => f.name === "BuiltByKern_GlassType.tsx")
if (!file) throw new Error("missing")
const updated = await file.setFileContent(code)
const errors = await updated.typecheck()
console.log("typecheck", JSON.stringify(errors).slice(0, 2000))
if (errors && errors.length) throw new Error("typecheck")

await new Promise((r) => setTimeout(r, 2500))
const dir = "/Users/noel/Desktop/Framer/docs/projects/listings"
fs.mkdirSync(dir, { recursive: true })
const home = await framer.screenshot("WQLkyLRf1", { format: "png", scale: 1 })
fs.writeFileSync(`${dir}/Kern_GlassType_home.png`, home.data)
console.log("home", home.data.length)
const thumb = await framer.screenshot("LpZFimpa4", { format: "png", scale: 1 })
fs.writeFileSync(`${dir}/Kern_GlassType_thumbnail.png`, thumb.data)
console.log("thumb1600", thumb.data.length)
const thumb2 = await framer.screenshot("LpZFimpa4", { format: "png", scale: 1.5 })
fs.writeFileSync(`${dir}/Kern_GlassType_thumbnail_2400.png`, thumb2.data)
console.log("thumb2400", thumb2.data.length)

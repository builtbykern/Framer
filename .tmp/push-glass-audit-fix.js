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
console.log("typecheck", JSON.stringify(errors).slice(0, 4000))
if (errors && errors.length) throw new Error("typecheck")

await new Promise((r) => setTimeout(r, 3000))
const shot = await framer.screenshot("WQLkyLRf1", { format: "png", scale: 1 })
fs.mkdirSync("/Users/noel/Desktop/Framer/docs/projects/listings", {
    recursive: true,
})
fs.writeFileSync(
    "/Users/noel/Desktop/Framer/docs/projects/listings/Kern_GlassType_audit_home.png",
    shot.data
)
console.log("home shot", shot.data.length)

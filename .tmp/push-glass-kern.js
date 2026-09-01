const fs = require("fs")
const code = fs.readFileSync(
    "/Users/noel/Desktop/Framer/state/BuiltByKern_GlassType.tsx",
    "utf8"
)
const files = await framer.getCodeFiles()
let file = files.find((f) => f.name === "BuiltByKern_GlassType.tsx")
if (!file) throw new Error("missing Glass Type file")
file = await file.setFileContent(code)
const errors = await file.typecheck()
console.log("typecheck", JSON.stringify(errors).slice(0, 2000))
console.log("ok", file.id)

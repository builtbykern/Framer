const fs = require("fs")

const code = fs.readFileSync(
    "/Users/noel/Desktop/Framer/state/BuiltByKern_GlassType.tsx",
    "utf8"
)

const files = await framer.getCodeFiles()
let file = files.find((f) => f.name === "BuiltByKern_GlassType.tsx")
if (!file) {
    file = await framer.createCodeFile("BuiltByKern_GlassType.tsx", code)
    console.log("created", file.id, file.name)
} else {
    file = await file.setFileContent(code)
    console.log("updated", file.id, file.name)
}

const errors = await file.typecheck()
console.log(
    "typecheck",
    JSON.stringify(errors, null, 2).slice(0, 4000)
)
console.log(
    "exports",
    (file.exports || []).map((e) => ({
        name: e.name,
        type: e.type,
        componentId: e.componentId || e.id,
        id: e.id,
    }))
)

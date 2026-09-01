const fs = require("fs")

const code = fs.readFileSync(
  "/Users/noel/Desktop/Framer/.tmp/BuiltByKern_FilmGrain.tsx",
  "utf8"
)

const files = await framer.getCodeFiles()
const names = files.map((f) => f.name)
console.log("files", names.filter((n) => /Noiser|Film|Grain|Noise/i.test(n)))

let file = files.find((f) => f.name === "BuiltByKern_FilmGrain.tsx")
if (!file) {
  file = await framer.createCodeFile("BuiltByKern_FilmGrain.tsx", code)
  console.log("created", file.id, file.name)
} else {
  file = await file.setFileContent(code)
  console.log("updated", file.id, file.name)
}

const errors = await file.typecheck()
console.log("typecheck", JSON.stringify(errors, null, 2).slice(0, 1200))
console.log(
  "exports",
  (file.exports || []).map((e) => ({
    name: e.name,
    type: e.type,
    componentId: e.componentId || e.id,
  }))
)

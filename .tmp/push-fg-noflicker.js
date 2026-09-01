const fs = require("fs")
async function push(name, path) {
  const file = await framer.getCodeFile(name)
  const updated = await file.setFileContent(fs.readFileSync(path, "utf8"))
  console.log(name, await updated.typecheck())
}
await push("BuiltByKern_FilmGrain.tsx", "/Users/noel/Desktop/Framer/.tmp/BuiltByKern_FilmGrain.tsx")
await push("BuiltByKern_Noiser.tsx", "/Users/noel/Desktop/Framer/.tmp/BuiltByKern_Noiser.tsx")

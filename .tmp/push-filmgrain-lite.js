const fs = require("fs")

async function push(name, path) {
  const file = await framer.getCodeFile(name)
  const updated = await file.setFileContent(fs.readFileSync(path, "utf8"))
  console.log(name, await updated.typecheck(), updated.exports?.[0]?.name)
}

await push("BuiltByKern_FilmGrain.tsx", "/Users/noel/Desktop/Framer/.tmp/BuiltByKern_FilmGrain.tsx")
await push("BuiltByKern_Noiser.tsx", "/Users/noel/Desktop/Framer/.tmp/BuiltByKern_Noiser.tsx")

const controls = { amount: 22, tint: "#1c1b16", size: 2, animate: true }
for (const id of ["J2vkzxhLh", "U3TeNUVXvJ2vkzxhLh", "pmAxXUJ0oJ2vkzxhLh"]) {
  await (await framer.getNode(id)).setAttributes({
    controls,
    name: "Film Grain",
    pointerEvents: "none",
    zIndex: 1,
  })
}
console.log("home ok", Object.keys((await framer.getNode("J2vkzxhLh")).typedControls || {}))

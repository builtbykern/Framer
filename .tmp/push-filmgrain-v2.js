const fs = require("fs")

async function push(name, path) {
  const code = fs.readFileSync(path, "utf8")
  const file = await framer.getCodeFile(name)
  const updated = await file.setFileContent(code)
  const errors = await updated.typecheck()
  console.log(name, errors, updated.exports?.[0]?.name)
}

await push(
  "BuiltByKern_FilmGrain.tsx",
  "/Users/noel/Desktop/Framer/.tmp/BuiltByKern_FilmGrain.tsx"
)
await push(
  "BuiltByKern_Noiser.tsx",
  "/Users/noel/Desktop/Framer/.tmp/BuiltByKern_Noiser.tsx"
)

// Home: template ink tint only — component defaults stay Marketplace-neutral
const controls = {
  look: "film",
  amount: 22,
  grainSize: 2,
  contrast: 50,
  tint: "#1c1b16",
  mix: "weave",
  flicker: true,
  tempo: "calm",
}

for (const id of ["J2vkzxhLh", "U3TeNUVXvJ2vkzxhLh", "pmAxXUJ0oJ2vkzxhLh"]) {
  const n = await framer.getNode(id)
  await n.setAttributes({
    controls,
    name: "Film Grain",
    pointerEvents: "none",
    zIndex: 1,
  })
  console.log("home", id)
}

const src = (await framer.getCodeFile("BuiltByKern_FilmGrain.tsx")).content
const bad = [
  "Gaussian",
  "Uniform",
  "Mono",
  "Duo",
  "noiseSize",
  "roughness",
  "speedFps",
  "feTurbulence",
  "Arbour",
  "Parchment",
  "Ink/Paper",
]
console.log(
  "scrub",
  bad.filter((b) => src.includes(b))
)
console.log(
  "controls",
  Object.keys(
    (await framer.getNode("J2vkzxhLh")).typedControls || {}
  )
)

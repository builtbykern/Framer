const fs = require("fs")

async function push(name, path) {
  const code = fs.readFileSync(path, "utf8")
  const file = await framer.getCodeFile(name)
  const updated = await file.setFileContent(code)
  const errors = await updated.typecheck()
  console.log(name, "typecheck", errors, "export", updated.exports?.[0]?.name)
}

await push(
  "BuiltByKern_FilmGrain.tsx",
  "/Users/noel/Desktop/Framer/.tmp/BuiltByKern_FilmGrain.tsx"
)
await push(
  "BuiltByKern_Noiser.tsx",
  "/Users/noel/Desktop/Framer/.tmp/BuiltByKern_Noiser.tsx"
)

const controls = {
  grainStyle: "soft",
  tone: "ink",
  ink: "#2c2a24",
  paper: "#efe9db",
  strength: 0.18,
  scale: 1.35,
  detail: 2,
  blendMode: "soft-light",
  motion: true,
  rate: 14,
}

for (const id of ["J2vkzxhLh", "U3TeNUVXvJ2vkzxhLh", "pmAxXUJ0oJ2vkzxhLh"]) {
  const n = await framer.getNode(id)
  await n.setAttributes({
    controls,
    name: "Film Grain",
    pointerEvents: "none",
    zIndex: 1,
  })
  console.log("tuned", id)
}

// Confirm no Gaussian/Uniform/Mono strings left in Noiser source
const noiser = await framer.getCodeFile("BuiltByKern_Noiser.tsx")
const src = noiser.content
const fingerprints = [
  "Gaussian",
  "Uniform",
  "Mono",
  "Duo",
  "Multi",
  "noiseSize",
  "roughness",
  "speedFps",
  "feTurbulence",
  "fractalNoise",
  "Noiser",
  "Arkuš",
  "arkus",
]
console.log(
  "fingerprints",
  fingerprints.filter((f) => src.includes(f))
)

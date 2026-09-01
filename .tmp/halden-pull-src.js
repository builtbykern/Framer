const fs = require("fs")
const dir = "/Users/noel/Desktop/Framer/.tmp/halden-src"
fs.mkdirSync(dir, { recursive: true })

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const files = await framer.getCodeFiles()
const want = ["Drift_Plane.tsx", "Series_Stills.tsx"]
const out = {}
for (const name of want) {
    const file = files.find((f) => f.name === name)
    if (!file) throw new Error(`missing ${name}`)
    const code = await file.content
    fs.writeFileSync(`${dir}/${name}`, code)
    out[name] = {
        bytes: code.length,
        hasEnter: code.includes("COLLECTION_ENTER_CSS") || code.includes("opacity: 0"),
        playCollectionMotion: code.includes("playCollectionMotion"),
        inCollection: code.includes("inCollection"),
        resetPose: code.includes("resetCollectionPose"),
        hostFrozen: code.includes("hostFrozen"),
    }
}
console.log(JSON.stringify({ project: info.name, out }, null, 2))

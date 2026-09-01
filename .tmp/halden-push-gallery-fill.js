const fs = require("fs")
const path = require("path")

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const src = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Series_Stills.tsx",
    "utf8"
)
if (!src.includes("position: \"absolute\"")) throw new Error("missing absolute fill")
if (!src.includes("position: \"relative\"")) throw new Error("missing relative crop")

const series = await framer.getCodeFile("Series_Stills.tsx")
if (!series) throw new Error("missing Series_Stills")
await series.setFileContent(src)
const seriesTc = await series.typecheck({ strict: true })

const outDir = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(outDir, { recursive: true })
const shots = []
for (const [id, name] of [
    ["afUswAq7g", "work-stills-fill.png"],
    ["yn0nMGJJL", "work-gallery-fill.png"],
    ["Tf2mbU7Bvyn0nMGJJL", "work-gallery-phone-fill.png"],
]) {
    try {
        const r = await framer.screenshot(id, { format: "png", scale: 1 })
        fs.writeFileSync(path.join(outDir, name), r.data)
        shots.push({ id, name, bytes: r.data.length })
    } catch (e) {
        shots.push({ id, name, error: String(e) })
    }
}

console.log(
    JSON.stringify(
        { project: info.name, seriesTc, shots },
        null,
        2
    )
)

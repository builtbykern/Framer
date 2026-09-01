const fs = require("fs")
const path = require("path")

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

function brief(n, depth = 0) {
    if (!n || depth > 5) return null
    const a = n.attributes || {}
    const controls = {}
    for (const [k, v] of Object.entries(a)) {
        if (
            k.startsWith("$control__") ||
            /gap|padding|visible|overflow|layout|width|height|position/i.test(k)
        ) {
            controls[k] = v
        }
    }
    return {
        id: n.id,
        name: n.name,
        type: n.type,
        ...controls,
        kids: (n.children || []).map((c) => brief(c, depth + 1)),
    }
}

const gallery = await framer.agent.serializeNodes(
    { ids: ["yn0nMGJJL", "afUswAq7g"], depth: 4 },
    { pagePath: "/work/:Work" }
)

const files = await framer.getCodeFiles()
const series = (files || []).find(
    (f) => f.id === "jeA2cvO" || f.name === "Series_Stills.tsx"
)
const src = typeof series?.content === "string" ? series.content : ""
const figureChunk = (src.match(/<figure[\s\S]{0,900}/) || [])[0]
const mediaChunk = (src.match(/objectFit[\s\S]{0,200}/) || [])[0]
const aspectHits = [...src.matchAll(/aspectRatio:[^\n]+/g)].map((m) => m[0])

const outDir = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(outDir, { recursive: true })
const shots = []
for (const [id, name] of [
    ["yn0nMGJJL", "work-gallery-before.png"],
    ["afUswAq7g", "work-stills-before.png"],
    ["rtJNTCNFr", "work-desktop-before.png"],
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
        {
            project: info.name,
            gallery: gallery.map((n) => brief(n)),
            seriesId: series?.id,
            seriesName: series?.name,
            aspectHits,
            mediaChunk,
            figureChunk: figureChunk ? figureChunk.slice(0, 800) : null,
            shots,
        },
        null,
        2
    )
)

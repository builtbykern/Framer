const fs = require("fs")
const path = require("path")

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const src = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Series_Stills.tsx",
    "utf8"
)
if (src.includes('objectFit: isGrid ? "cover" : "contain"')) {
    throw new Error("source still has contain")
}
if (src.includes('aspectRatio: isGrid ? "1 / 1" : "3 / 2"')) {
    throw new Error("source still has figure 3/2")
}

const files = await framer.getCodeFiles()
const series =
    (files || []).find((f) => f.name === "Series_Stills.tsx") ||
    (files || []).find((f) => f.id === "jeA2cvO")
if (!series) throw new Error("missing Series_Stills")

await series.setFileContent(src)
const live = await framer.getCodeFile("Series_Stills.tsx")
const seriesTc = await live.typecheck({ strict: true })

const applied = await framer.agent.applyChanges(
    `SET afUswAq7g $control__gap="28";`,
    { pagePath: "/work/:Work" }
)

const stills = await framer.agent.serializeNodes(
    {
        ids: ["afUswAq7g", "LSqc1L2WHafUswAq7g", "Tf2mbU7BvafUswAq7g"],
        depth: 0,
    },
    { pagePath: "/work/:Work" }
)

const outDir = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(outDir, { recursive: true })
const shots = []
for (const [id, name] of [
    ["afUswAq7g", "work-stills-after.png"],
    ["yn0nMGJJL", "work-gallery-after.png"],
    ["Tf2mbU7Bvyn0nMGJJL", "work-gallery-phone-after.png"],
]) {
    try {
        const r = await framer.screenshot(id, { format: "png", scale: 1 })
        fs.writeFileSync(path.join(outDir, name), r.data)
        shots.push({ id, name, bytes: r.data.length })
    } catch (e) {
        shots.push({ id, name, error: String(e) })
    }
}

const liveSrc = String(live.content || "")
console.log(
    JSON.stringify(
        {
            project: info.name,
            fileId: series.id,
            seriesTc,
            applyErrors: applied.errors,
            applyParse: applied.parseErrors,
            stills: stills.map((n) => ({
                id: n.id,
                name: n.name,
                gap: n.attributes?.$control__gap,
            })),
            liveHasContain: liveSrc.includes('objectFit: isGrid ? "cover" : "contain"'),
            liveFigure32: liveSrc.includes('aspectRatio: isGrid ? "1 / 1" : "3 / 2"'),
            liveCoverFit: liveSrc.includes('objectFit: "cover"'),
            shots,
        },
        null,
        2
    )
)

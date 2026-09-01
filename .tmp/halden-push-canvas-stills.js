const fs = require("fs")
const path = require("path")

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const src = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Series_Stills.tsx",
    "utf8"
)
if (!src.includes("lookbookOnCanvas")) throw new Error("missing lookbookOnCanvas")
if (!src.includes("useIsOnFramerCanvas")) {
    throw new Error("missing useIsOnFramerCanvas")
}

const file = await framer.getCodeFile("Series_Stills.tsx")
if (!file) throw new Error("missing Series_Stills.tsx")
await file.setFileContent(src)
const live = await framer.getCodeFile("Series_Stills.tsx")
const typeErrors = await live.typecheck({ strict: true })

const cleared = { skipped: "cover stays bound; lookbookOnCanvas ignores it" }

const nodes = await framer.agent.serializeNodes(
    { ids: ["afUswAq7g", "LSqc1L2WHafUswAq7g", "Tf2mbU7BvafUswAq7g"], depth: 0 },
    { pagePath: "/work/:Work" }
)

const outDir = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(outDir, { recursive: true })
const shots = []
for (const [id, name] of [
    ["afUswAq7g", "canvas-stills-fallback.png"],
    ["yn0nMGJJL", "canvas-gallery-fallback.png"],
    ["rtJNTCNFr", "canvas-work-fallback.png"],
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
            typeErrors,
            applyErrors: cleared.errors,
            applyParse: cleared.parseErrors,
            covers: nodes.map((n) => ({
                id: n.id,
                cover: n.attributes?.$control__cover ?? null,
                images: Boolean(n.attributes?.$control__images),
            })),
            liveHasCanvasStills: String(live.content || "").includes(
                "CANVAS_STILLS"
            ),
            shots,
        },
        null,
        2
    )
)

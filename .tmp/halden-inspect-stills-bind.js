const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const stills = await framer.agent.serializeNodes(
    { ids: ["yGFlVus2I", "GAokM9PPJ", "FddpNYFNF", "nt9Gs3MMs"], depth: 1 },
    { pagePath: "/" }
)

function pick(n) {
    const a = n.attributes || {}
    const controls = {}
    for (const [k, v] of Object.entries(a)) {
        if (k.startsWith("$control__") || k === "text" || k === "fill" || k === "visible") {
            controls[k] = v
        }
    }
    return { id: n.id, name: n.name, type: n.type, ...controls }
}

const file = await framer.getCodeFile("Series_Stills.tsx")
const c = String(file?.content || "")
console.log(
    JSON.stringify(
        {
            project: info.name,
            fileId: file?.id,
            hasPaint: c.includes("isCssPaintSrc"),
            nodes: stills.map(pick),
        },
        null,
        2
    )
)

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const ids = ["XwtyrQVdF", "FddpNYFNF", "tpUu5gNAo", "GAokM9PPJ"]
const nodes = {}
for (const id of ids) {
    const n = await framer.agent.getNode({ id }, { pagePath: "/" })
    const a = n?.attributes || {}
    nodes[id] = {
        name: n?.name,
        fontName: a.fontName,
        fontSize: a.fontSize,
        fontWeight: a.fontWeight,
        letterSpacing: a.letterSpacing,
        textStylePreset: a.textStylePreset,
    }
}
console.log(JSON.stringify({ project: info.name, nodes }, null, 2))

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const nav = await framer.agent.getNode({ id: "Yptm4PAEu" }, { pagePath: "/" })
const attrs = nav?.attributes || {}
const keep = {}
for (const [k, v] of Object.entries(attrs)) {
    if (
        k.includes("variant") ||
        k.includes("menu") ||
        k.includes("open") ||
        k === "name" ||
        k === "componentId" ||
        k.startsWith("$control")
    ) {
        keep[k] = v
    }
}
console.log(JSON.stringify({ name: nav?.name, keep }, null, 2))

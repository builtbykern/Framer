const fs = require("fs")

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const file = await framer.getCodeFile("Drift_Plane.tsx")
if (!file) throw new Error("Drift_Plane.tsx not found")
fs.writeFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Drift_Plane.tsx",
    file.content
)

const controls = await framer.agent.readComponentControls({
    componentIds: ["codeFile/Og5966a:default"],
})
const roots = await framer.agent.serializeNodes({
    ids: ["WQLkyLRf1", "BjqrvIntT", "nyI5jW7lA"],
    depth: 6,
})

const instances = []
const walk = (node, rootId) => {
    if (node.component === "codeFile/Og5966a:default") {
        instances.push({
            rootId,
            id: node.id,
            name: node.name,
            attributes: node.attributes,
        })
    }
    for (const child of node.children || []) walk(child, rootId)
}
for (const root of roots) walk(root, root.id)

console.log(
    JSON.stringify(
        {
            typeErrors: await file.typecheck({ strict: true }),
            controls,
            instances,
        },
        null,
        2
    )
)

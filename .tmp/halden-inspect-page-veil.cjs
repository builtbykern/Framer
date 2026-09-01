const fs = require("fs")

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const file = await framer.getCodeFile("Page_Veil.tsx")
if (!file) throw new Error("Page_Veil.tsx not found")
fs.writeFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Page_Veil.tsx",
    file.content
)

const roots = await framer.agent.serializeNodes({
    ids: ["augiA20Il", "nizhx6wAX", "fpoP3kuA4"],
    depth: 4,
})
const instances = []
const walk = (node, pageId) => {
    if (node.component === "codeFile/D6GDbcv:default") {
        instances.push({
            pageId,
            id: node.id,
            name: node.name,
            attributes: node.attributes,
        })
    }
    for (const child of node.children || []) walk(child, pageId)
}
for (const root of roots) walk(root, root.id)

console.log(
    JSON.stringify(
        {
            typeErrors: await file.typecheck({ strict: true }),
            instances,
        },
        null,
        2
    )
)

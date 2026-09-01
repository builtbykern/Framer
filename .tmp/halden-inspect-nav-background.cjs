const roots = await framer.agent.serializeNodes({
    ids: ["WQLkyLRf1", "BjqrvIntT", "nyI5jW7lA"],
    depth: 5,
    attributeFilter: [
        "name",
        "fill",
        "backgroundColor",
        "backgroundBlur",
        "opacity",
        "width",
        "height",
        "position",
        "zIndex",
        "$control__variant",
    ],
})

const matches = []
const walk = (node, rootId) => {
    if (/nav/i.test(node.name || "")) {
        matches.push({
            rootId,
            id: node.id,
            type: node.type,
            name: node.name,
            component: node.component,
            attributes: node.attributes,
        })
    }
    for (const child of node.children || []) walk(child, rootId)
}
for (const root of roots) walk(root, root.id)

console.log(JSON.stringify({ matches }, null, 2))

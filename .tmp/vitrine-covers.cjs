function dumpCovers(node, acc = []) {
    if (!node) return acc
    if (node.name === "Cover" || node.name === "Still") {
        acc.push({ id: node.id, name: node.name, parent: node.$parentId })
    }
    for (const c of node.children || []) dumpCovers(c, acc)
    return acc
}

const card = await framer.agent.serializeNodes({
    ids: ["OdvHkNWXz"],
    depth: 3,
    attributeFilter: ["name"],
})
console.log(JSON.stringify(dumpCovers(card[0]), null, 2))

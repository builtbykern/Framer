const desktop = await framer.getNode("WQLkyLRf1")
const kids = desktop.children ?? []
function walk(nodes, depth) {
    const out = []
    for (const n of nodes || []) {
        out.push({
            id: n.id,
            name: n.name,
            type: n.type,
            depth,
        })
        if (n.children) out.push(...walk(n.children, depth + 1))
    }
    return out
}
const tree = walk(kids, 0)
const glass = tree.filter(
    (n) =>
        String(n.name || "").includes("Glass") ||
        String(n.type || "").includes("code")
)
console.log("tree", JSON.stringify(tree.slice(0, 40), null, 2))
console.log("glass-ish", JSON.stringify(glass, null, 2))

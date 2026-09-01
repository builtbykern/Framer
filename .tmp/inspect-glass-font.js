const files = await framer.getCodeFiles()
console.log(
    "files",
    files.map((f) => f.name).join(", ")
)
const desk = await framer.agent.serialize(
    { id: "WQLkyLRf1", depth: 3 },
    { pagePath: "/" }
)
function walk(n, acc) {
    if (!n) return acc
    acc.push({
        id: n.id,
        name: n.name,
        type: n.type,
        insert: n.attributes?.insert,
        content: n.attributes?.["$control__content"],
    })
    for (const c of n.children || []) walk(c, acc)
    return acc
}
const nodes = walk(desk, [])
const glass = nodes.filter(
    (n) =>
        (n.name && String(n.name).toLowerCase().includes("glass")) ||
        (n.content && JSON.stringify(n.content).includes("font"))
)
console.log("glass", JSON.stringify(glass, null, 2).slice(0, 4000))
console.log(
    "names",
    nodes.map((n) => `${n.id} ${n.name} ${n.type}`).join("\n")
)

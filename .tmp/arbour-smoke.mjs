const pages = await framer.getNodesWithType("WebPageNode")
console.log(JSON.stringify({ count: (pages || []).length, paths: (pages || []).map((p) => p.path) }))
const p = (pages || []).find((x) => x.path === "/")
if (!p) {
    console.log("NO_HOME")
} else {
    const ser = await framer.agent.serialize({ id: p.id, depth: 2 }, {})
    console.log(JSON.stringify({ desk: (ser.children || []).map((c) => c.name) }))
}

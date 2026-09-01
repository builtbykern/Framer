const pages = await framer.getNodesWithType("WebPageNode")
const hits = []
for (const p of pages || []) {
    if (!p.path) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 8 }, {})
    function walk(n, trail, bp) {
        if (!n) return
        const display = n.attributes?.$componentDisplayName || ""
        const name = n.name || ""
        const comp = n.component || ""
        if (/ScrollCue/i.test(name + display) || comp.includes("GruqKYi")) {
            hits.push({
                path: p.path,
                bp,
                id: n.id,
                name: name || display,
                trail: trail.join(" > "),
                coords: n.attributes?.$control__coordinates,
                label: n.attributes?.$control__label,
            })
        }
        for (const c of n.children || []) walk(c, trail.concat(name || n.type), bp)
    }
    for (const bp of ser.children || []) walk(bp, [bp.name], bp.name)
}
return hits.filter((h) => h.bp === "Desktop")

const pages = await framer.getNodesWithType("WebPageNode")
const hits = []
for (const p of pages || []) {
    if (!p.path) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 5 }, {})
    for (const bp of ser.children || []) {
        function walk(n, parent) {
            if (!n) return
            if ((n.name || "").includes("ProgressiveBlur")) {
                const a = n.attributes || {}
                hits.push({
                    path: p.path,
                    bp: bp.name,
                    id: n.id,
                    parentId: parent?.id || bp.id,
                    parentName: parent?.name || bp.name,
                    opacity: a.opacity || null,
                    w: a.width,
                    h: a.height,
                    pos: a.position,
                    bottom: a.bottom,
                    top: a.top,
                    left: a.left,
                    right: a.right,
                    z: a.zIndex,
                    strength: a["$control__strength"],
                    coverage: a["$control__coverage"],
                    blurPos: a["$control__position"],
                })
            }
            for (const c of n.children || []) walk(c, n)
        }
        walk(bp, null)
    }
}
return {
    total: hits.length,
    desktop: hits.filter((h) => h.bp === "Desktop"),
}

const pages = await framer.getNodesWithType("WebPageNode")
const out = []
for (const path of ["/properties", "/properties/:slug", "/notes/:slug"]) {
    const p = pages.find((x) => x.path === path)
    if (!p) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 7 }, {})
    for (const bp of ser.children || []) {
        const walk = (n, trail, d = 0) => {
            if (!n || d > 8) return
            const pth = `${trail}/${n.name || "?"}`
            if (/Discovery Routes/i.test(pth)) {
                out.push({
                    page: path,
                    bp: bp.name,
                    name: n.name || "?",
                    h: n.attributes?.height ?? null,
                    w: n.attributes?.width ?? null,
                    id: n.id,
                })
            }
            for (const c of n.children || []) walk(c, pth, d + 1)
        }
        walk(bp, path)
    }
}
return out

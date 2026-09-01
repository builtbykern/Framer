function parsePad(pad) {
    if (!pad) return null
    const p = String(pad).trim().split(/\s+/)
    if (p.length === 4) return { r: p[1], l: p[3] }
    if (p.length === 2) return { r: p[1], l: p[1] }
    if (p.length === 1) return { r: p[0], l: p[0] }
    return null
}
function hasH(p) {
    if (!p) return false
    const z = (v) => v === "0" || v === "0px"
    return !z(p.r) || !z(p.l)
}
const bad = []
const all90 = []
function walk(n, bp, d = 0) {
    if (!n || d > 10) return
    const a = n.attributes || {}
    const w = String(a.width || "")
    const mw = String(a.maxWidth || "")
    if (w === "90%" || mw === "90%") {
        const pad = a.padding != null ? String(a.padding) : null
        all90.push({ bp, name: n.name, id: n.id, pad, w, mw })
        if (hasH(parsePad(pad))) bad.push({ bp, name: n.name, id: n.id, pad })
    }
    for (const c of n.children || []) walk(c, bp, d + 1)
}
const pages = await framer.getNodesWithType("WebPageNode")
const p404 = pages.find((p) => p.path === "/404" || p.path === "404")
if (!p404) return { missing: true, paths: pages.map((p) => p.path) }
const ser = await framer.agent.serialize({ id: p404.id, depth: 10 }, {})
for (const bp of ser.children || []) walk(bp, bp.name)
return { bad, all90, badCount: bad.length, total90: all90.length }

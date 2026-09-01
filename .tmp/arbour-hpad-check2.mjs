const left = []
function parsePad(pad) {
    if (!pad) return null
    const p = String(pad).trim().split(/\s+/)
    if (p.length === 4) return { t: p[0], r: p[1], b: p[2], l: p[3] }
    if (p.length === 2) return { t: p[0], r: p[1], b: p[0], l: p[1] }
    if (p.length === 1) return { t: p[0], r: p[0], b: p[0], l: p[0] }
    if (p.length === 3) return { t: p[0], r: p[1], b: p[2], l: p[1] }
    return null
}
function hasH(p) {
    if (!p) return false
    const z = (v) => v === "0" || v === "0px"
    return !z(p.r) || !z(p.l)
}
function walk(n, path, bp, d = 0) {
    if (!n || d > 9) return
    const a = n.attributes || {}
    const w = String(a.width || "")
    const mw = String(a.maxWidth || "")
    const pad = a.padding != null ? String(a.padding) : null
    if ((w === "90%" || mw === "90%") && hasH(parsePad(pad))) {
        left.push({ path, bp, name: n.name || "(x)", id: n.id, w, mw, pad })
    }
    for (const c of n.children || []) walk(c, path, bp, d + 1)
}
const CONTENT = [
    "/",
    "/properties",
    "/neighbourhoods",
    "/notes",
    "/about",
    "/contact",
    "/properties/:slug",
    "/notes/:slug",
]
const pages = await framer.getNodesWithType("WebPageNode")
for (const path of CONTENT) {
    const p = pages.find((x) => x.path === path)
    if (!p) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 8 }, {})
    for (const bp of ser.children || []) walk(bp, path, bp.name, 0)
}
const comps = await framer.getNodesWithType("ComponentNode")
const navTops = []
for (const want of ["Nav", "Footer"]) {
    const c = comps.find((x) => x.name === want)
    if (!c) continue
    const ser = await framer.agent.serialize({ id: c.id, depth: 6 }, {})
    for (const v of ser.children || []) {
        walk(v, "comp:" + want, v.name, 0)
        const top = (v.children || []).find((ch) => ch.name === "top")
        if (top) {
            navTops.push({
                variant: v.name,
                id: top.id,
                w: top.attributes?.width,
                mw: top.attributes?.maxWidth,
                pad: top.attributes?.padding,
            })
        }
        const grid = (v.children || []).find((ch) => /Editorial Grid/i.test(ch.name || ""))
        if (grid) {
            navTops.push({
                kind: "grid",
                variant: v.name,
                id: grid.id,
                w: grid.attributes?.width,
                mw: grid.attributes?.maxWidth,
                pad: grid.attributes?.padding,
            })
        }
    }
}
return { leftoverCount: left.length, leftovers: left.slice(0, 40), navTops }

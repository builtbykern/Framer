/**
 * Exhaustive audit: any node with width/maxWidth 90% that still has horizontal padding.
 * Also report 90% nodes (pad ok) counts, and full-bleed shells that KEEP h-pad (expected).
 */
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

function parsePad(pad) {
    if (!pad) return null
    const p = String(pad).trim().split(/\s+/)
    if (p.length === 4) return { t: p[0], r: p[1], b: p[2], l: p[3], raw: pad }
    if (p.length === 2) return { t: p[0], r: p[1], b: p[0], l: p[1], raw: pad }
    if (p.length === 1) return { t: p[0], r: p[0], b: p[0], l: p[0], raw: pad }
    if (p.length === 3) return { t: p[0], r: p[1], b: p[2], l: p[1], raw: pad }
    return null
}

function hasH(p) {
    if (!p) return false
    const z = (v) => v === "0" || v === "0px"
    return !z(p.r) || !z(p.l)
}

function is90(a = {}) {
    const w = a.width != null ? String(a.width) : ""
    const mw = a.maxWidth != null ? String(a.maxWidth) : ""
    return w === "90%" || mw === "90%"
}

const bad = []
const ok90 = []
const byPath = {}

function walk(n, path, bp, trail, d = 0) {
    if (!n || d > 12) return
    const name = n.name || "(unnamed)"
    const a = n.attributes || {}
    if (is90(a)) {
        const pad = a.padding != null ? String(a.padding) : null
        const parsed = parsePad(pad)
        const entry = {
            path,
            bp,
            name,
            id: n.id,
            w: a.width ?? null,
            mw: a.maxWidth ?? null,
            pad,
            trail: trail + "/" + name,
        }
        const key = path + "|" + bp
        byPath[key] = byPath[key] || { total90: 0, bad: 0 }
        byPath[key].total90++
        if (hasH(parsed)) {
            bad.push(entry)
            byPath[key].bad++
        } else {
            ok90.push(entry)
        }
    }
    for (const c of n.children || []) {
        walk(c, path, bp, trail + "/" + name, d + 1)
    }
}

const pages = await framer.getNodesWithType("WebPageNode")
const pagePaths = pages.map((p) => p.path)
const missing = CONTENT.filter((p) => !pages.find((x) => x.path === p))

for (const path of CONTENT) {
    const p = pages.find((x) => x.path === path)
    if (!p) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 12 }, {})
    for (const bp of ser.children || []) {
        walk(bp, path, bp.name || "?", path, 0)
    }
}

const COMPS = [
    "Nav",
    "Footer",
    "Arbour_PrincipalProfile",
    "Arbour Neighbourhood Feature",
    "Services card",
    "Arbour_OfficeAtlasPanel",
    "Arbour_StatsBand",
]
const comps = await framer.getNodesWithType("ComponentNode")
const compNames = comps.map((c) => c.name)
const missingComps = COMPS.filter((n) => !comps.find((c) => c.name === n))

for (const want of COMPS) {
    const c = comps.find((x) => x.name === want)
    if (!c) continue
    const ser = await framer.agent.serialize({ id: c.id, depth: 10 }, {})
    for (const v of ser.children || []) {
        walk(v, "comp:" + want, v.name || "?", want, 0)
    }
}

// Also: any Frame on any page with 90% we might have missed via getNodes?
// Spot-check: count nodes where width is 90% but padding still has 48/40/16 horizontal via string match
const stringHits = bad.filter((b) => /48px|40px|16px|24px|32px|64px|96px|128px/.test(b.pad || ""))

return {
    pagePaths,
    missingPages: missing,
    missingComps,
    total90: ok90.length + bad.length,
    okCount: ok90.length,
    badCount: bad.length,
    bad,
    byPath,
    stringHits: stringHits.length,
    // sample of ok with non-zero vertical pad to prove we kept vertical
    okWithVertical: ok90.filter((o) => o.pad && o.pad !== "0px" && o.pad !== "0").slice(0, 15),
}

/**
 * Strip horizontal padding from content columns that already use width 90%.
 * Keep vertical pad. Full-bleed shells (width 100%) keep L/R gutters.
 */
const NL = String.fromCharCode(10)
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

const SKIP = /Atmosphere|Cue|ScrollCue|Noise|Mesh|Gradient Overlay|Image Layer|Bottom Parallax|Drawer|Menu Icon|logo|hamburger|Status/i

function parsePad(pad) {
    if (!pad || typeof pad !== "string") return null
    const parts = pad.trim().split(/\s+/)
    if (parts.length === 1) {
        return { t: parts[0], r: parts[0], b: parts[0], l: parts[0] }
    }
    if (parts.length === 2) {
        return { t: parts[0], r: parts[1], b: parts[0], l: parts[1] }
    }
    if (parts.length === 3) {
        return { t: parts[0], r: parts[1], b: parts[2], l: parts[1] }
    }
    if (parts.length === 4) {
        return { t: parts[0], r: parts[1], b: parts[2], l: parts[3] }
    }
    return null
}

function hasHorizontal(p) {
    if (!p) return false
    const z = (v) => v === "0" || v === "0px"
    return !z(p.r) || !z(p.l)
}

function verticalOnly(p) {
    const z = "0px"
    // collapse to shortest form when possible
    if (p.t === p.b) {
        if (p.t === z || p.t === "0") return "0px"
        return `${p.t} 0px`
    }
    return `${p.t} 0px ${p.b} 0px`
}

const lines = []
const log = []
const seen = new Set()

function maybeStrip(n, path, bp) {
    if (!n?.id || seen.has(n.id)) return
    const name = n.name || "(unnamed)"
    if (SKIP.test(name)) return
    const a = n.attributes || {}
    const w = a.width != null ? String(a.width) : null
    const mw = a.maxWidth != null ? String(a.maxWidth) : null
    // content column pattern
    const is90 = w === "90%" || (mw === "90%" && (w === "90%" || w === "1fr" || w === "100%"))
    if (!is90) return
    const pad = a.padding != null ? String(a.padding) : null
    const parsed = parsePad(pad)
    if (!parsed || !hasHorizontal(parsed)) return
    const next = verticalOnly(parsed)
    if (next === pad) return
    seen.add(n.id)
    lines.push(`SET ${n.id} padding="${next}";`)
    log.push(`${path}|${bp}|${name}: ${pad} → ${next}`)
}

function walk(n, path, bp, d = 0) {
    if (!n || d > 10) return
    maybeStrip(n, path, bp)
    for (const c of n.children || []) walk(c, path, bp, d + 1)
}

const pages = await framer.getNodesWithType("WebPageNode")
for (const path of CONTENT) {
    const p = pages.find((x) => x.path === path)
    if (!p) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 9 }, {})
    for (const bp of ser.children || []) {
        for (const top of bp.children || []) {
            walk(top, path, bp.name || "?", 1)
        }
    }
}

// Nav + Footer components
const comps = await framer.getNodesWithType("ComponentNode")
for (const want of ["Nav", "Footer", "Arbour_PrincipalProfile", "Arbour Neighbourhood Feature", "Services card", "Arbour_OfficeAtlasPanel"]) {
    const c = comps.find((x) => x.name === want)
    if (!c) continue
    const ser = await framer.agent.serialize({ id: c.id, depth: 8 }, {})
    for (const v of ser.children || []) {
        walk(v, `comp:${want}`, v.name || "?", 1)
    }
}

const CHUNK = 60
const results = []
for (let i = 0; i < lines.length; i += CHUNK) {
    const chunk = lines.slice(i, i + CHUNK).join(NL)
    const r = await framer.agent.applyChanges(chunk, {})
    results.push({
        i,
        n: Math.min(CHUNK, lines.length - i),
        errors: r.errors || null,
        warnings: (r.warnings || []).slice(0, 3),
    })
}

return {
    applied: lines.length,
    sample: log.slice(0, 50),
    more: log.length > 50 ? log.length - 50 : 0,
    results,
}

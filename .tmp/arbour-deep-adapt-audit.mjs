/**
 * Deeper adaptation audit: all BPs, nested maxWidth leftovers, fixed px heights on media.
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

const SKIP_NAMES = /Atmosphere|Nav|Cue|ScrollCue|Noise|Mesh|Gradient Overlay|Image Layer|Bottom Parallax/i
const NARROW_OK = new Set([
    "720px",
    "640px",
    "560px",
    "520px",
    "480px",
    "420px",
    "400px",
    "360px",
    "320px",
    "280px",
    "240px",
    "200px",
    "180px",
    "160px",
    "120px",
    "96px",
    "80px",
    "64px",
    "48px",
    "40px",
    "32px",
    "24px",
    "16px",
])

const pages = await framer.getNodesWithType("WebPageNode")
const leftovers = [] // maxWidth still 1200/1440/1680/80%
const missing90 = [] // content-ish nodes with no maxW under filled shell
const fixedH = [] // image-like fixed px height >= 140
const shellIssues = []

function hasFill(a = {}) {
    const f = a.backgroundColor ?? a.fill ?? null
    return !!(f && f !== "null" && f !== "none" && f !== "")
}

function looksMedia(name = "") {
    return /image|photo|portrait|gallery|hero|media|thumb|card|rail|field|visual|cover|shot/i.test(
        name
    )
}

function walk(n, ctx, d = 0) {
    if (!n || d > 10) return
    const name = n.name || "(unnamed)"
    if (SKIP_NAMES.test(name) && d > 0) {
        // still walk children of Atmosphere for ScrollBlur etc — skip deep
        for (const c of n.children || []) walk(c, ctx, d + 1)
        return
    }
    const a = n.attributes || {}
    const mw = a.maxWidth != null ? String(a.maxWidth) : null
    const h = a.height != null ? String(a.height) : null
    const w = a.width != null ? String(a.width) : null
    const pos = a.position || null
    const filled = hasFill(a)

    // leftover old caps
    if (mw && /^(1200|1440|1680|1100|1000|1280)px$|^80%$|^85%$/.test(mw)) {
        leftovers.push({
            path: ctx.path,
            bp: ctx.bp,
            name,
            id: n.id,
            mw,
            trail: ctx.trail,
            filled,
            depth: d,
        })
    }

    // filled shell with maxW (bad)
    if (d <= 2 && filled && mw && mw !== "100%") {
        shellIssues.push({
            kind: "filled+maxW",
            path: ctx.path,
            bp: ctx.bp,
            name,
            id: n.id,
            mw,
        })
    }

    // fixed px heights on media-ish
    if (h && /^\d+(\.\d+)?px$/.test(h)) {
        const nH = parseFloat(h)
        if (nH >= 140 && (looksMedia(name) || nH >= 280)) {
            fixedH.push({
                path: ctx.path,
                bp: ctx.bp,
                name,
                id: n.id,
                h: nH,
                w,
                mw,
                trail: ctx.trail + "/" + name,
            })
        }
    }

    const nextTrail = ctx.trail + "/" + name
    for (const c of n.children || []) {
        walk(c, { ...ctx, trail: nextTrail, parentFilled: filled || ctx.parentFilled }, d + 1)
    }
}

const bpSummaries = []

for (const path of CONTENT) {
    const p = pages.find((x) => x.path === path)
    if (!p) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 8 }, {})
    for (const bp of ser.children || []) {
        const bpName = bp.name || "?"
        bpSummaries.push({ path, bp: bpName, tops: (bp.children || []).length })
        for (const top of bp.children || []) {
            walk(top, { path, bp: bpName, trail: path, parentFilled: false }, 1)
        }
    }
}

// Also components commonly used
const COMPS = [
    "Footer",
    "Arbour Neighbourhood Feature",
    "Arbour_PrincipalProfile",
    "Services card",
    "Arbour_OfficeAtlasPanel",
    "Arbour_StatsBand",
]
const comps = await framer.getNodesWithType("ComponentNode")
for (const want of COMPS) {
    const c = comps.find((x) => x.name === want)
    if (!c) continue
    const ser = await framer.agent.serialize({ id: c.id, depth: 6 }, {})
    for (const v of ser.children || []) {
        walk(v, { path: `comp:${want}`, bp: v.name || "?", trail: want, parentFilled: false }, 1)
    }
}

return {
    leftovers: leftovers.slice(0, 80),
    leftoverCount: leftovers.length,
    shellIssues,
    fixedH: fixedH.slice(0, 100),
    fixedHCount: fixedH.length,
    bpSummaries,
}

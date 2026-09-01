/**
 * Map: which top/mid sections wrongly combine fill OR media with maxWidth 90%.
 * Canon: full-bleed BG shells uncapped; content children 90%.
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

const pages = await framer.getNodesWithType("WebPageNode")
const bad = []
const good = []

function hasFill(a = {}) {
    const f = a.backgroundColor ?? a.fill ?? null
    return !!(f && f !== "null" && f !== "none" && f !== "")
}

function hasImageBg(a = {}) {
    // background image / image fill hints
    const keys = Object.keys(a)
    return keys.some((k) => /image|backgroundImage|background\.|src/i.test(k) && a[k])
}

for (const path of CONTENT) {
    const p = pages.find((x) => x.path === path)
    if (!p) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 4 }, {})
    for (const bp of ser.children || []) {
        const bpName = bp.name || "?"
        for (const top of bp.children || []) {
            const tName = top.name || ""
            if (/Atmosphere|Nav|Cue|ScrollCue/i.test(tName)) continue
            const ta = top.attributes || {}
            const tMw = ta.maxWidth != null ? String(ta.maxWidth) : null
            const tFilled = hasFill(ta)
            // Top-level with media children that should bleed
            const kids = top.children || []
            const kidSummary = kids.map((k) => {
                const a = k.attributes || {}
                return {
                    name: k.name || "(x)",
                    id: k.id,
                    mw: a.maxWidth != null ? String(a.maxWidth) : null,
                    filled: hasFill(a),
                    h: a.height ?? null,
                    w: a.width ?? null,
                    pos: a.position ?? null,
                }
            })

            // Case A: top has maxW AND is a visual/hero shell (image layer child or named hero)
            const hasImageLayer = kids.some((k) =>
                /Image Layer|Gradient|Entrance Media|Hero Image|Opening Image|Journal Hero/i.test(
                    k.name || ""
                )
            )
            const isHeroish = /Hero|Beat 2|Journal Hero|Bottom\b/i.test(tName)

            if (tMw && (hasImageLayer || (isHeroish && !tFilled))) {
                bad.push({
                    kind: "top-capped-visual",
                    path,
                    bp: bpName,
                    name: tName,
                    id: top.id,
                    mw: tMw,
                    filled: tFilled,
                    kids: kidSummary,
                })
            }

            // Case B: mid children have fill + 90% (BG won't bleed under parent)
            for (const k of kids) {
                const a = k.attributes || {}
                const mw = a.maxWidth != null ? String(a.maxWidth) : null
                const filled = hasFill(a)
                if (filled && mw && /90%/.test(mw)) {
                    // Parent should be the fill shell; this mid node should either drop fill or drop maxW
                    bad.push({
                        kind: "mid-fill+90",
                        path,
                        bp: bpName,
                        parent: tName,
                        name: k.name || "(x)",
                        id: k.id,
                        mw,
                        // also check if parent is filled uncapped (ok pattern if fill is same?)
                        parentMw: tMw,
                        parentFilled: tFilled,
                    })
                }
            }

            if (!tMw && tFilled) {
                good.push({ path, bp: bpName, name: tName, pattern: "shell-bleed" })
            }
        }
    }
}

// Component variants with huge fixed maxWidth
const comps = await framer.getNodesWithType("ComponentNode")
const compBad = []
for (const name of [
    "Footer",
    "Arbour_PrincipalProfile",
    "Arbour Neighbourhood Feature",
    "Arbour_OfficeAtlasPanel",
    "Arbour_StatsBand",
    "Services card",
]) {
    const c = comps.find((x) => x.name === name)
    if (!c) continue
    const ser = await framer.agent.serialize({ id: c.id, depth: 3 }, {})
    for (const v of ser.children || []) {
        const a = v.attributes || {}
        compBad.push({
            comp: name,
            variant: v.name,
            id: v.id,
            mw: a.maxWidth ?? null,
            w: a.width ?? null,
            h: a.height ?? null,
        })
        for (const ch of v.children || []) {
            const ca = ch.attributes || {}
            if (ca.maxWidth && /px$/.test(String(ca.maxWidth)) && parseFloat(ca.maxWidth) >= 800) {
                compBad.push({
                    comp: name,
                    variant: v.name,
                    name: ch.name,
                    id: ch.id,
                    mw: ca.maxWidth,
                    note: "child-wide-px",
                })
            }
        }
    }
}

return {
    badCount: bad.length,
    bad: bad.slice(0, 80),
    goodCount: good.length,
    compBad,
}

/**
 * Post-fix audit: remaining risk + hero text column centering + Bottom outliers
 */
const pages = await framer.getNodesWithType("WebPageNode")
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
const SHELL = /Loading|Smooth|Atmosphere|Noise|Blur|Scroll|Nav|Footer|Cue/i

const risk = []
const heroCols = []
const bottoms = []

for (const path of CONTENT) {
    const p = pages.find((x) => x.path === path)
    if (!p) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 4 }, {})
    for (const bp of ser.children || []) {
        for (const c of bp.children || []) {
            if (SHELL.test(c.name || "")) continue
            const a = c.attributes || {}
            const pad = String(a.padding || "")
            const parts = pad.match(/([\d.]+)px/g) || []
            let lr = null
            if (parts.length === 1) lr = parseFloat(parts[0])
            else if (parts.length === 2) lr = parseFloat(parts[1])
            else if (parts.length === 3) lr = parseFloat(parts[1])
            else if (parts.length === 4) {
                const r = parseFloat(parts[1])
                const l = parseFloat(parts[3])
                lr = Math.min(l, r)
            }
            const fullBleedLR = lr === 0 || pad === "0px" || pad === "0" || pad === ""
            // empty pad with no maxWidth is risk unless component (Stats was empty pad - now fixed)
            const hasMax = !!a.maxWidth
            const isRisk =
                !hasMax &&
                !(fullBleedLR && (pad.includes("0px") || pad === "" || pad === "0")) &&
                (a.width === "100%" || a.width === "1fr" || !a.width)

            // stricter: no maxWidth + has horizontal pad > 0
            const hasHorizPad = lr != null && lr > 0
            if (!hasMax && hasHorizPad) {
                risk.push({
                    path,
                    bp: bp.name,
                    name: c.name,
                    maxWidth: a.maxWidth || null,
                    width: a.width,
                    pad,
                    align: a.stackAlignment,
                })
            }

            if (c.name === "Bottom" || c.name === "Hero Section") {
                bottoms.push({
                    path,
                    bp: bp.name,
                    name: c.name,
                    maxWidth: a.maxWidth || null,
                    width: a.width,
                    pad,
                    align: a.stackAlignment,
                })
            }

            if (c.name === "Hero Section") {
                const walk = (n) => {
                    if (!n) return
                    if (n.name === "Text Content Column") {
                        const na = n.attributes || {}
                        heroCols.push({
                            bp: bp.name,
                            id: n.id,
                            maxWidth: na.maxWidth,
                            width: na.width,
                            pad: na.padding,
                            align: na.stackAlignment,
                            parentAlign: a.stackAlignment,
                            parentLayout: a.layout,
                        })
                    }
                    for (const ch of n.children || []) walk(ch)
                }
                walk(c)
            }
        }
    }
}

// StatsBand pad check
const stats = []
{
    const p = pages.find((x) => x.path === "/")
    const ser = await framer.agent.serialize({ id: p.id, depth: 3 }, {})
    for (const bp of ser.children || []) {
        const s = (bp.children || []).find((c) => c.name === "Arbour_StatsBand")
        if (!s) continue
        stats.push({
            bp: bp.name,
            maxWidth: s.attributes?.maxWidth,
            width: s.attributes?.width,
            pad: s.attributes?.padding,
            align: s.attributes?.stackAlignment,
            child0: s.children?.[0]
                ? {
                      name: s.children[0].name,
                      maxWidth: s.children[0].attributes?.maxWidth,
                      pad: s.children[0].attributes?.padding,
                      width: s.children[0].attributes?.width,
                  }
                : null,
        })
    }
}

return { risk, heroCols, bottoms, stats }

/**
 * Audit: maxWidth coverage + fixed px heights that will look squat at 90% ultrawide.
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
const comps = await framer.getNodesWithType("ComponentNode")

const missing90 = [] // content shells without 90%
const fixedHeights = [] // notable fixed px heights >= 80

function hasFill(a = {}) {
    const f = a.backgroundColor ?? a.fill ?? null
    return !!(f && f !== "null" && f !== "none")
}

function walkHeights(n, path, d = 0) {
    if (!n || d > 5) return
    const a = n.attributes || {}
    const h = a.height
    if (h && /^\d+(\.\d+)?px$/.test(h)) {
        const nH = parseFloat(h)
        if (nH >= 80) {
            fixedHeights.push({
                path: `${path}/${n.name || n.id}`,
                id: n.id,
                h: nH,
                w: a.width ?? null,
                maxW: a.maxWidth ?? null,
                aspect: a.aspectRatio ?? null,
                minH: a.minHeight ?? null,
            })
        }
    }
    for (const c of n.children || []) walkHeights(c, path, d + 1)
}

for (const path of CONTENT) {
    const p = pages.find((x) => x.path === path)
    if (!p) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 4 }, {})
    for (const bp of ser.children || []) {
        if (bp.name !== "Desktop") continue // sample desktop for height audit breadth
        for (const c of bp.children || []) {
            const name = c.name || ""
            if (/Atmosphere|Nav|Cue|Footer$/i.test(name)) continue
            if (/Hero Section|Beat 2|Cinematic Image/i.test(name)) {
                // full-bleed shells OK
                walkHeights(c, `${path}|${bp.name}|${name}`, 0)
                continue
            }
            const a = c.attributes || {}
            const filled = hasFill(a)
            if (filled) {
                // shell should have no maxW; kids should have 90%
                if (a.maxWidth) {
                    missing90.push({
                        path,
                        bp: bp.name,
                        name,
                        issue: `filled shell has maxW=${a.maxWidth}`,
                        id: c.id,
                    })
                }
                for (const ch of c.children || []) {
                    if (ch.attributes?.position === "absolute") continue
                    const mw = ch.attributes?.maxWidth
                    if (mw !== "90%") {
                        missing90.push({
                            path,
                            bp: bp.name,
                            name: `${name}>${ch.name || ch.id}`,
                            issue: `child maxW=${mw || "NONE"}`,
                            id: ch.id,
                        })
                    }
                }
            } else {
                const named =
                    /Section|Journal|Manifesto|Opening|Chapter|Enquiry|Contact|Portfolio|Process|Recognition|Testimonial|Stats|Particulars|Gallery|Setting|Search|Strip|Pause|Beat|Content|Hero|Closing|Specs|Article|Column|Bottom/i.test(
                        name,
                    )
                if (named && a.maxWidth !== "90%" && a.maxWidth !== "100%") {
                    missing90.push({
                        path,
                        bp: bp.name,
                        name,
                        issue: `section maxW=${a.maxWidth || "NONE"}`,
                        id: c.id,
                    })
                }
            }
            walkHeights(c, `${path}|${bp.name}|${name}`, 0)
        }
    }
}

// Footer + Nav comps
for (const name of ["Footer", "Nav"]) {
    const c = comps.find((x) => x.name === name)
    if (!c) continue
    const ser = await framer.agent.serialize({ id: c.id, depth: 5 }, {})
    for (const bp of ser.children || []) {
        if (bp.name !== "Desktop" && !/^Desktop/.test(bp.name)) continue
        walkHeights(bp, `Comp/${name}|${bp.name}`, 0)
    }
}

// Sort tallest fixed heights
fixedHeights.sort((a, b) => b.h - a.h)

return {
    missing90Count: missing90.length,
    missing90: missing90.slice(0, 60),
    fixedHeightCount: fixedHeights.length,
    fixedHeightsTop: fixedHeights.slice(0, 50),
}

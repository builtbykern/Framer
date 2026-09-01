/**
 * Audit maxWidth / width / section padding across Arbour pages × breakpoints.
 * Flag: missing maxWidth on content sections, outlier maxWidths, full-bleed vs constrained.
 */
const fs = require("fs")

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

const SHELL =
    /Loading|Smooth|Atmosphere|Noise|Blur|Scroll|Nav|Footer|Cue/i

const pages = await framer.getNodesWithType("WebPageNode")
const report = []
const byMaxW = {} // maxW -> [{path,bp,name,id}]
const missingMax = [] // content-ish sections with width 100% and no maxWidth
const outliers = []

function parsePx(v) {
    if (v == null || v === "null") return null
    if (typeof v === "number") return v
    const m = String(v).match(/^([\d.]+)px$/)
    if (m) return Number(m[1])
    if (v === "100%" || v === "1fr" || v === "auto" || v === "fit-content") return v
    return String(v)
}

for (const path of CONTENT) {
    const p = pages.find((x) => x.path === path)
    if (!p) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 5 }, {})

    for (const bp of ser.children || []) {
        const bpW = bp.attributes?.width || bp.attributes?.canvasWidth || null
        const tops = []

        for (const c of bp.children || []) {
            if (SHELL.test(c.name || "")) continue
            const a = c.attributes || {}
            const entry = {
                path,
                bp: bp.name,
                id: c.id,
                name: c.name,
                depth: 1,
                width: a.width || null,
                maxWidth: a.maxWidth || null,
                minWidth: a.minWidth || null,
                pad: a.padding || null,
                layout: a.layout || null,
                stackDir: a.stackDirection || null,
            }
            tops.push(entry)

            const mw = a.maxWidth || "NONE"
            if (!byMaxW[mw]) byMaxW[mw] = []
            byMaxW[mw].push(`${path}|${bp.name}|${c.name}`)

            // content section candidates: relative stacks with horizontal pad or width 100%
            const pad = a.padding || ""
            const hasHorizPad = /\d+px\s+\d+px/.test(pad) || /48px|40px|16px/.test(pad)
            const isFullBleed =
                (a.padding === "0px" ||
                    a.padding === "0" ||
                    /^0px(\s+0px){0,3}$/.test(String(a.padding || ""))) &&
                !a.maxWidth

            if (
                !a.maxWidth &&
                (a.width === "100%" || !a.width) &&
                hasHorizPad &&
                !/Hero|Beat 1|Portrait|Cinematic|Rail|Gallery|full/i.test(c.name || "")
            ) {
                missingMax.push(entry)
            }

            // nested key content wrappers one level deeper
            for (const d of c.children || []) {
                const da = d.attributes || {}
                if (da.maxWidth || /Hero|Copy|Content|Grid|Chapter|Enquiry|Journal|Section/i.test(d.name || "")) {
                    const e2 = {
                        path,
                        bp: bp.name,
                        id: d.id,
                        name: d.name,
                        depth: 2,
                        parent: c.name,
                        width: da.width || null,
                        maxWidth: da.maxWidth || null,
                        pad: da.padding || null,
                    }
                    tops.push(e2)
                    const mw2 = da.maxWidth || "NONE"
                    if (!byMaxW[mw2]) byMaxW[mw2] = []
                    byMaxW[mw2].push(`${path}|${bp.name}|${c.name}>${d.name}`)
                }
            }
        }

        report.push({
            path,
            bp: bp.name,
            bpWidth: bpW,
            topSections: tops.filter((t) => t.depth === 1),
            nestedInteresting: tops.filter((t) => t.depth === 2).slice(0, 40),
        })
    }
}

// Summarize maxWidth distribution
const dist = Object.fromEntries(
    Object.entries(byMaxW)
        .map(([k, v]) => [k, v.length])
        .sort((a, b) => b[1] - a[1]),
)

// Find non-canonical maxWidths (not 1200, 1440, 100%, none, 730, 342, etc.)
const canonical = new Set([
    "NONE",
    "1200px",
    "1440px",
    "100%",
    "730px",
    "810px",
    "342px",
    "480px",
    "670px",
    "560px",
    "520px",
])
for (const [mw, list] of Object.entries(byMaxW)) {
    if (!canonical.has(mw) && !/^[\d.]+px$/.test(mw)) continue
    if (mw !== "NONE" && mw !== "1200px" && mw !== "1440px" && mw !== "100%") {
        if (list.length <= 15) {
            outliers.push({ maxWidth: mw, count: list.length, samples: list.slice(0, 8) })
        }
    }
}

const out = {
    collectedAt: new Date().toISOString(),
    dist,
    missingMax: missingMax.slice(0, 60),
    missingMaxCount: missingMax.length,
    outliers,
    // Desktop-focused view of top sections maxWidth
    desktopTops: report
        .filter((r) => r.bp === "Desktop")
        .map((r) => ({
            path: r.path,
            sections: r.topSections.map((s) => ({
                name: s.name,
                maxWidth: s.maxWidth,
                width: s.width,
                pad: s.pad,
            })),
        })),
}

fs.writeFileSync(
    "/Users/noel/Desktop/Framer/.tmp/arbour-maxwidth-audit.json",
    JSON.stringify({ ...out, full: report }, null, 2),
)

return {
    dist,
    missingMaxCount: missingMax.length,
    missingMaxSample: missingMax.slice(0, 25),
    outliers: outliers.slice(0, 20),
    desktopTops: out.desktopTops,
}

/**
 * Cross-page: any content shell still missing maxWidth; Contact/Notes hero inner text cols;
 * About Beat 2 1440 note; Bottom outliers; page breakpoint widths.
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

const summary = []
const noMax = []
const pageMeta = []

for (const path of CONTENT) {
    const p = pages.find((x) => x.path === path)
    if (!p) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 2 }, {})
    for (const bp of ser.children || []) {
        pageMeta.push({
            path,
            bp: bp.name,
            width: bp.attributes?.width,
            align: bp.attributes?.stackAlignment,
        })
        for (const c of bp.children || []) {
            if (SHELL.test(c.name || "")) continue
            const mw = c.attributes?.maxWidth || "NONE"
            summary.push(`${path}|${bp.name}|${c.name}|${mw}|${c.attributes?.width || "?"}`)
            if (mw === "NONE") {
                noMax.push({
                    path,
                    bp: bp.name,
                    name: c.name,
                    pad: c.attributes?.padding,
                    width: c.attributes?.width,
                })
            }
        }
    }
}

return { noMax, pageMeta, summarySample: summary.filter((s) => s.includes("NONE") || s.includes("1440") || s.includes("810") || s.includes("390")) }

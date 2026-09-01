/**
 * Constrain Footer instances to maxWidth 1200 across content pages × BPs
 * so ultrawide aligns with Journal / Territories (was full-bleed @ pad 48).
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
    "/404",
]

const pages = await framer.getNodesWithType("WebPageNode")
const lines = []
const notes = []

for (const path of CONTENT) {
    const p = pages.find((x) => x.path === path)
    if (!p) {
        notes.push(`skip missing ${path}`)
        continue
    }
    const ser = await framer.agent.serialize({ id: p.id, depth: 2 }, {})
    for (const bp of ser.children || []) {
        for (const c of bp.children || []) {
            if (c.name !== "Footer") continue
            const mw = c.attributes?.maxWidth
            const w = c.attributes?.width
            if (mw !== "1200px") {
                lines.push(`SET ${c.id} maxWidth="1200px";`)
                notes.push(`${path}|${bp.name} Footer ${mw || "NONE"}→1200`)
            } else {
                notes.push(`ok ${path}|${bp.name} maxW`)
            }
            // ensure width fills up to max (1fr or 100%)
            if (w !== "1fr" && w !== "100%") {
                lines.push(`SET ${c.id} width="1fr";`)
                notes.push(`${path}|${bp.name} Footer width ${w || "NONE"}→1fr`)
            }
        }
    }
}

if (!lines.length) return { applied: 0, notes }

const result = await framer.agent.applyChanges(lines.join("\n"), {})
return { applied: lines.length, notes, result: result?.message || result }

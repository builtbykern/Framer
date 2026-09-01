/**
 * Fix notes/:slug page align start → center (all BPs) so maxWidth shells center on ultrawide.
 * Also audit any other content pages with align !== center.
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
const lines = []
const notes = []

for (const path of CONTENT) {
    const p = pages.find((x) => x.path === path)
    if (!p) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 1 }, {})
    for (const bp of ser.children || []) {
        const align = bp.attributes?.stackAlignment
        if (align !== "center") {
            lines.push(`SET ${bp.id} stackAlignment="center";`)
            notes.push(`${path}|${bp.name}: ${align || "NONE"}→center id=${bp.id}`)
        } else {
            notes.push(`ok ${path}|${bp.name}`)
        }
    }
}

if (!lines.length) return { applied: 0, notes }

const result = await framer.agent.applyChanges(lines.join("\n"), {})
return { applied: lines.length, notes, result: result?.message || result }

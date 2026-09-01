/**
 * Restore Discovery route media cards that lost 420px height (set to auto by failed aspect pass).
 * Use vh so they scale: Desktop 38vh, Tablet 32vh, Phone 28vh.
 */
const pages = await framer.getNodesWithType("WebPageNode")
const lines = []
const notes = []
const vh = { Desktop: "38vh", Tablet: "32vh", Phone: "28vh" }

for (const path of ["/properties", "/properties/:slug", "/notes/:slug", "/"]) {
    const p = pages.find((x) => x.path === path)
    if (!p) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 7 }, {})
    for (const bp of ser.children || []) {
        const targetH = vh[bp.name] || "32vh"
        const walk = (n, trail, d = 0) => {
            if (!n || d > 8) return
            const pth = `${trail}/${n.name || "?"}`
            const under =
                /Discovery Routes|Continue Your Search/i.test(pth) &&
                !/Label|Title|Copy|Status|Filter/i.test(n.name || "")
            const h = n.attributes?.height
            const w = n.attributes?.width
            // media-like: was likely 420 card — auto + 1fr/100% under discovery
            if (
                under &&
                (h === "auto" || h === "420px") &&
                (w === "1fr" || w === "100%") &&
                n.children?.length >= 0
            ) {
                // Only leaf-ish frames with fill or significant size intent — skip text stacks named
                if (/Properties Label|Title|Copy|All Properties|Discovery Label|Discovery Routes$/i.test(n.name || "x")) {
                    // skip named structural
                } else if (!n.name || /Card|Image|Photo|Route|Link|Panel|Frame/i.test(n.name) || n.name === undefined) {
                    // unnamed auto 1fr under discovery routes = the image cards
                    if ((!n.name || n.name === "?") && h === "auto" && w === "1fr") {
                        lines.push(`SET ${n.id} height="${targetH}";`)
                        notes.push(`${path}|${bp.name}|card →${targetH} id=${n.id}`)
                    } else if (h === "420px") {
                        lines.push(`SET ${n.id} height="${targetH}";`)
                        notes.push(`${path}|${bp.name}|${n.name||"?"} 420→${targetH}`)
                    }
                }
            }
            for (const c of n.children || []) walk(c, pth, d + 1)
        }
        walk(bp, path)
    }
}

if (!lines.length) return { applied: 0, notes: ["noop"] }
const r = await framer.agent.applyChanges(lines.join("\n"), {})
return { applied: lines.length, notes: notes.slice(0, 40), result: r?.message || r }

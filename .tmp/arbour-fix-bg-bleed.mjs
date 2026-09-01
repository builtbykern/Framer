/**
 * Fix verified violations:
 * 1) About Atmosphere (+ Noise) Tablet/Phone: width 810/390 → 100%
 * 2) About Beat 2 Cinematic: clear maxWidth (full-bleed BG); Image Editorial Overlay → 1200
 * Also sweep ALL Atmosphere/Noise fixed canvas widths → 100%
 */
const pages = await framer.getNodesWithType("WebPageNode")
const lines = []
const notes = []

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

for (const path of CONTENT) {
    const p = pages.find((x) => x.path === path)
    if (!p) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 4 }, {})
    for (const bp of ser.children || []) {
        for (const c of bp.children || []) {
            // Atmosphere + nested noise/blur
            if (/Atmosphere/i.test(c.name || "")) {
                if (c.attributes?.maxWidth) {
                    lines.push(`SET ${c.id} maxWidth="null";`)
                    notes.push(`${path}|${bp.name}|Atmosphere clear maxW`)
                }
                if (
                    c.attributes?.width &&
                    c.attributes.width !== "100%" &&
                    c.attributes.width !== "1fr"
                ) {
                    lines.push(`SET ${c.id} width="100%";`)
                    notes.push(
                        `${path}|${bp.name}|Atmosphere ${c.attributes.width}→100%`,
                    )
                }
                const walkBg = (n, d = 0) => {
                    if (!n || d > 3) return
                    if (/Noise|Blur|Mesh/i.test(n.name || "")) {
                        if (n.attributes?.maxWidth) {
                            lines.push(`SET ${n.id} maxWidth="null";`)
                            notes.push(
                                `${path}|${bp.name}|${n.name} clear maxW`,
                            )
                        }
                        const w = n.attributes?.width
                        if (w && w !== "100%" && w !== "1fr" && w !== "auto") {
                            lines.push(`SET ${n.id} width="100%";`)
                            notes.push(
                                `${path}|${bp.name}|${n.name} ${w}→100%`,
                            )
                        }
                    }
                    for (const ch of n.children || []) walkBg(ch, d + 1)
                }
                walkBg(c)
            }

            // Beat 2 cinematic — full-bleed BG, content overlay capped
            if (/Beat 2|Cinematic Image/i.test(c.name || "")) {
                if (c.attributes?.maxWidth) {
                    lines.push(`SET ${c.id} maxWidth="null";`)
                    notes.push(
                        `${path}|${bp.name}|${c.name} clear maxW (full-bleed)`,
                    )
                }
                if (c.attributes?.width !== "100%") {
                    lines.push(`SET ${c.id} width="100%";`)
                    notes.push(`${path}|${bp.name}|${c.name} width→100%`)
                }
                if (c.attributes?.stackAlignment !== "center") {
                    lines.push(`SET ${c.id} stackAlignment="center";`)
                    notes.push(`${path}|${bp.name}|${c.name} align→center`)
                }
                for (const ch of c.children || []) {
                    if (/Overlay|Editorial/i.test(ch.name || "")) {
                        if (ch.attributes?.maxWidth !== "1200px") {
                            lines.push(`SET ${ch.id} maxWidth="1200px";`)
                            notes.push(
                                `${path}|${bp.name}|${ch.name} →1200`,
                            )
                        }
                        if (
                            ch.attributes?.width !== "1fr" &&
                            ch.attributes?.width !== "100%"
                        ) {
                            lines.push(`SET ${ch.id} width="1fr";`)
                        }
                    }
                }
            }
        }
    }
}

if (!lines.length) return { applied: 0, notes: ["noop"] }

const result = await framer.agent.applyChanges(lines.join("\n"), {})
return { applied: lines.length, notes, result: result?.message || result }

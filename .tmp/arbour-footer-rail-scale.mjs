/**
 * Footer Editorial Property Rail — scale heights for large screens.
 * Desktop ×1.55 (stagger preserved); Tablet ×1.25; Phone slight bump.
 * Sync nested minHeights; rail height → auto so it fits children.
 */
const SCALE = {
    Desktop: 1.55,
    Tablet: 1.25,
    Phone: 1.1,
}

const comps = await framer.getNodesWithType("ComponentNode")
const footer = comps.find((c) => c.name === "Footer")
if (!footer) return { error: "no footer" }

const ser = await framer.agent.serialize({ id: footer.id, depth: 6 }, {})
const lines = []
const notes = []

function px(n) {
    return `${Math.round(n)}px`
}

function scaleHeight(cur, factor) {
    if (!cur) return null
    const m = String(cur).match(/^([\d.]+)px$/)
    if (!m) return null
    return px(parseFloat(m[1]) * factor)
}

for (const bp of ser.children || []) {
    const factor = SCALE[bp.name] || 1
    const rail = (bp.children || []).find((c) =>
        /Editorial Property Rail/i.test(c.name || ""),
    )
    if (!rail) continue

    // Rail container: auto height, full width, no maxWidth
    if (rail.attributes?.height && rail.attributes.height !== "auto") {
        lines.push(`SET ${rail.id} height="auto";`)
        notes.push(`${bp.name}|rail height→auto (was ${rail.attributes.height})`)
    }
    if (rail.attributes?.maxWidth) {
        lines.push(`SET ${rail.id} maxWidth="null";`)
        notes.push(`${bp.name}|rail clear maxW`)
    }
    if (rail.attributes?.width !== "100%" && rail.attributes?.width !== "1fr") {
        lines.push(`SET ${rail.id} width="100%";`)
        notes.push(`${bp.name}|rail width→100%`)
    }

    for (const item of rail.children || []) {
        if (!/Rail Property/i.test(item.name || "")) continue
        const h = item.attributes?.height
        const newH = scaleHeight(h, factor)
        if (newH && newH !== h) {
            lines.push(`SET ${item.id} height="${newH}";`)
            notes.push(`${bp.name}|${item.name} h ${h}→${newH}`)
        }

        // Walk nested frames with matching minHeight
        const walk = (n, d = 0) => {
            if (!n || d > 4) return
            const mh = n.attributes?.minHeight
            const newMh = scaleHeight(mh, factor)
            if (newMh && newMh !== mh) {
                lines.push(`SET ${n.id} minHeight="${newMh}";`)
                notes.push(
                    `${bp.name}|${item.name}>… minH ${mh}→${newMh}`,
                )
            }
            // fixed px heights on nested (not 1fr)
            const nh = n.attributes?.height
            if (nh && /^\d/.test(nh) && nh.endsWith("px") && n.id !== item.id) {
                const scaled = scaleHeight(nh, factor)
                if (scaled && scaled !== nh) {
                    lines.push(`SET ${n.id} height="${scaled}";`)
                    notes.push(
                        `${bp.name}|${item.name}>… h ${nh}→${scaled}`,
                    )
                }
            }
            for (const c of n.children || []) walk(c, d + 1)
        }
        walk(item, 0)
    }
}

if (!lines.length) return { applied: 0, notes: ["noop"] }

const NL = "\n"
const result = await framer.agent.applyChanges(lines.join(NL), {})
return { applied: lines.length, notes, result: result?.message || result }

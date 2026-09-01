/**
 * Align Nav open drawer content with top bar: Drawer Split → width 90%, H-pad 0.
 */
const NL = String.fromCharCode(10)
const ser = await framer.agent.serialize({ id: "ynpqYJGOd", depth: 5 }, {})
const lines = []
const log = []

function parsePad(pad) {
    if (!pad) return null
    const p = String(pad).trim().split(/\s+/)
    if (p.length === 4) return { t: p[0], r: p[1], b: p[2], l: p[3] }
    if (p.length === 2) return { t: p[0], r: p[1], b: p[0], l: p[1] }
    if (p.length === 1) return { t: p[0], r: p[0], b: p[0], l: p[0] }
    if (p.length === 3) return { t: p[0], r: p[1], b: p[2], l: p[1] }
    return null
}

function verticalOnly(p) {
    if (!p) return null
    if (p.t === p.b) return `${p.t} 0px`
    return `${p.t} 0px ${p.b} 0px`
}

for (const v of ser.children || []) {
    if (!/Open/i.test(v.name || "")) continue
    const container = (v.children || []).find((c) => c.name === "container")
    if (!container) continue
    // center children (top is sibling; container's child Drawer Split)
    lines.push(`SET ${container.id} stackAlignment="center";`)
    log.push(`${v.name}/container align center`)

    const split = (container.children || []).find((c) => /Drawer Split/i.test(c.name || ""))
    if (!split) continue
    lines.push(`SET ${split.id} width="90%";`)
    lines.push(`SET ${split.id} maxWidth="90%";`)
    const parsed = parsePad(split.attributes?.padding)
    if (parsed) {
        const next = verticalOnly(parsed)
        lines.push(`SET ${split.id} padding="${next}";`)
        log.push(`${v.name}/Drawer Split → 90% pad ${split.attributes?.padding} → ${next}`)
    } else {
        log.push(`${v.name}/Drawer Split → 90%`)
    }
}

const dsl = lines.join(NL)
const r = await framer.agent.applyChanges(dsl, {})
return { n: lines.length, log, errors: r.errors || null, warnings: (r.warnings || []).slice(0, 5) }

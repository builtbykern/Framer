/**
 * Color coherence fix pass:
 * - Ink 60 → Ink Soft (site meta standard)
 * - Nav Menu Icon #FFF/#1C1B16 → Paper / Ink
 * - Footer Paper Mesh #FCFAF4 → Paper
 * - Services card dead token → Ink Soft
 * - Remove unused Racing Deep 60 (Racing Wash 60 covers overlays)
 */
const NL = String.fromCharCode(10)

const Soft = "var(--token-0bc68d0d-4c0b-4126-8cce-9425cb153f4e)"
const Paper = "var(--token-d5b3c09d-0364-4ed0-8804-e56957faa275)"
const Ink = "var(--token-e2f9a9eb-668a-4021-80d9-b04413b5f392)"
const Ink60 = "cf5bf9af-72f6-4da6-ad12-b9daaa07387b"

const lines = []
const notes = []

// 1) Swap every Ink 60 textColor/fill to Ink Soft (pages + components)
const pages = await framer.getNodesWithType("WebPageNode")
const comps = await framer.getNodesWithType("ComponentNode")

async function scanAndCollect(rootId, label) {
    const ser = await framer.agent.serialize({ id: rootId, depth: 8 }, {})
    function walk(n) {
        if (!n) return
        const a = n.attributes || {}
        for (const [k, v] of Object.entries(a)) {
            if (typeof v !== "string") continue
            if (v.includes(Ink60)) {
                lines.push(`SET ${n.id} ${k}="${Soft}";`)
                notes.push(`${label}: Ink60→Soft ${n.name || n.id} ${k}`)
            }
            // Nav menu icons
            if (k === "$control__color" && (n.name === "Menu Icon" || /Menu Icon/i.test(n.name || ""))) {
                if (/#FFFFFF|#fff|rgb\(\s*255\s*,\s*255\s*,\s*255\s*\)/i.test(v)) {
                    lines.push(`SET ${n.id} ${k}="${Paper}";`)
                    notes.push(`${label}: MenuIcon white→Paper`)
                }
                if (/#1C1B16|rgb\(\s*28\s*,\s*27\s*,\s*22\s*\)/i.test(v)) {
                    lines.push(`SET ${n.id} ${k}="${Ink}";`)
                    notes.push(`${label}: MenuIcon ink→Ink`)
                }
            }
            // Footer mesh
            if (
                /Paper Mesh/i.test(n.name || "") &&
                /backgroundColor|fill/i.test(k) &&
                /#FCFAF4|rgb\(\s*252\s*,\s*250\s*,\s*244\s*\)/i.test(v)
            ) {
                lines.push(`SET ${n.id} ${k}="${Paper}";`)
                notes.push(`${label}: Mesh→Paper`)
            }
            // Services dead token
            if (v.includes("3bc5f574-f65c-4d38-8888-80d60545fb82")) {
                lines.push(`SET ${n.id} ${k}="${Soft}";`)
                notes.push(`${label}: dead token→Ink Soft ${n.name}`)
            }
        }
        for (const c of n.children || []) walk(c)
    }
    // ComponentNode serialize returns variants as children
    if (ser.children) for (const bp of ser.children) walk(bp)
    else walk(ser)
}

for (const p of pages || []) {
    if (!p.path) continue
    await scanAndCollect(p.id, p.path)
}
for (const c of comps || []) {
    await scanAndCollect(c.id, `comp:${c.name}`)
}

// Deduplicate lines
const uniq = [...new Set(lines)]

const chunkSize = 60
const results = []
for (let i = 0; i < uniq.length; i += chunkSize) {
    const chunk = uniq.slice(i, i + chunkSize)
    const r = await framer.agent.applyChanges(chunk.join(NL), {})
    results.push({ n: chunk.length, message: r?.message })
}

// Remove unused Racing Deep 60
let removed = null
const styles = await framer.getColorStyles()
const deep60 = styles.find((s) => s.name === "Racing Deep 60")
if (deep60) {
    // confirm zero uses in a quick pass
    let uses = 0
    for (const p of pages || []) {
        const ser = await framer.agent.serialize({ id: p.id, depth: 5 }, {})
        const dump = JSON.stringify(ser)
        if (dump.includes(deep60.id)) uses++
    }
    if (uses === 0) {
        await deep60.remove()
        removed = deep60.id
    } else {
        removed = `kept uses=${uses}`
    }
}

return {
    lineCount: uniq.length,
    notes: notes.slice(0, 40),
    noteCount: notes.length,
    results,
    removedRacingDeep60: removed,
}

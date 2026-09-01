/**
 * Content layout maxWidth: 1680px → 80%
 * Only bumps nodes currently at 1680px (layout shells / nav top / footer grid).
 * Leaves editorial narrow maxWidths (720, 880, etc.) untouched.
 */
const FROM = "1680px"
const TO = "80%"

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
const comps = await framer.getNodesWithType("ComponentNode")
const ids = []
const notes = []
const seen = new Set()

function collect(n, path, d = 0) {
    if (!n || d > 7) return
    if (n.attributes?.maxWidth === FROM && n.id && !seen.has(n.id)) {
        seen.add(n.id)
        ids.push(n.id)
        notes.push(`${path}/${n.name || n.id}`)
    }
    for (const c of n.children || []) collect(c, path, d + 1)
}

for (const path of CONTENT) {
    const p = pages.find((x) => x.path === path)
    if (!p) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 6 }, {})
    collect(ser, path, 0)
}

for (const name of ["Footer", "Nav"]) {
    const c = comps.find((x) => x.name === name)
    if (!c) continue
    const ser = await framer.agent.serialize({ id: c.id, depth: 5 }, {})
    collect(ser, `Comp/${name}`, 0)
}

const NL = "\n"
const lines = ids.map((id) => `SET ${id} maxWidth="${TO}";`)
const results = []
for (let i = 0; i < lines.length; i += 40) {
    const chunk = lines.slice(i, i + 40)
    const r = await framer.agent.applyChanges(chunk.join(NL), {})
    results.push(r?.message || String(r))
}

return {
    applied: lines.length,
    noteCount: notes.length,
    sample: notes.slice(0, 20),
    results,
}

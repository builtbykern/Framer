/**
 * Content layout maxWidth: 80% → 90%
 */
const FROM = "80%"
const TO = "90%"

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
const seen = new Set()

function collect(n, d = 0) {
    if (!n || d > 7) return
    if (n.attributes?.maxWidth === FROM && n.id && !seen.has(n.id)) {
        seen.add(n.id)
        ids.push(n.id)
    }
    for (const c of n.children || []) collect(c, d + 1)
}

for (const path of CONTENT) {
    const p = pages.find((x) => x.path === path)
    if (!p) continue
    collect(await framer.agent.serialize({ id: p.id, depth: 6 }, {}), 0)
}
for (const name of ["Footer", "Nav"]) {
    const c = comps.find((x) => x.name === name)
    if (!c) continue
    collect(await framer.agent.serialize({ id: c.id, depth: 5 }, {}), 0)
}

const NL = "\n"
const lines = ids.map((id) => `SET ${id} maxWidth="${TO}";`)
const results = []
for (let i = 0; i < lines.length; i += 40) {
    const r = await framer.agent.applyChanges(lines.slice(i, i + 40).join(NL), {})
    results.push(r?.message || String(r))
}

return { applied: lines.length, results }

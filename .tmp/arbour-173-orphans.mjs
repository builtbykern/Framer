/**
 * 173 — delete true orphan code files after hit re-check
 */
const REMOVE = [
    { id: "qAxfgzH", name: "Arbour_SectionHeader.tsx" },
    { id: "AXjaz2Z", name: "HideHorizontalScrollbar.tsx" },
    { id: "NN1s2o1", name: "Arbour_TerritoryHero.tsx" },
    { id: "CbZkhOy", name: "Arbour_BlendDisplay.tsx" },
    { id: "TE5IJ7M", name: "Arbour_BlendStyle.tsx" },
]
const ids = new Set(REMOVE.map((r) => r.id))

const pages = await framer.getNodesWithType("WebPageNode")
const comps = await framer.getNodesWithType("ComponentNode")

function countHits(n, map) {
    if (!n) return
    const c = String(n.component || "")
    const m = c.match(/codeFile\/([^:]+)/)
    if (m && ids.has(m[1])) map[m[1]] = (map[m[1]] || 0) + 1
    for (const ch of n.children || []) countHits(ch, map)
}

const hits = {}
for (const p of pages || []) {
    const ser = await framer.agent.serialize({ id: p.id, depth: 14 }, {})
    countHits(ser, hits)
}
for (const c of comps || []) {
    const ser = await framer.agent.serialize({ id: c.id, depth: 14 }, {})
    countHits(ser, hits)
}

const blocked = REMOVE.filter((r) => (hits[r.id] || 0) > 0)
if (blocked.length) {
    console.log(JSON.stringify({ ok: false, blocked, hits }, null, 2))
} else {
    const results = []
    for (const r of REMOVE) {
        const file = await framer.getCodeFile(r.name).catch(() => null)
        const f2 = file || (await framer.getCodeFile(r.id).catch(() => null))
        // try by listing
        const all = await framer.getCodeFiles()
        const found = (all || []).find((f) => f.id === r.id || f.name === r.name)
        if (!found) {
            results.push({ ...r, status: "already_gone" })
            continue
        }
        try {
            await found.remove()
            results.push({ ...r, status: "removed" })
        } catch (e) {
            results.push({ ...r, status: "err", err: String(e.message || e) })
        }
    }
    const after = await framer.getCodeFiles()
    const still = (after || []).filter((f) => ids.has(f.id)).map((f) => f.name)
    console.log(JSON.stringify({ ok: still.length === 0, results, still }, null, 2))
}

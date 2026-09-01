/**
 * Remove Arbour_LoadingScreen from all pages (Desktop primaries → replicas).
 * Keep the code file unless unused after — user said no loading yet; remove instances only
 * unless they want file gone too. Remove instances; leave code file for later.
 */
const NL = String.fromCharCode(10)
const notes = []

const pages = await framer.getNodesWithType("WebPageNode")
const delPrimary = []

for (const p of pages || []) {
    if (!p.path) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 4 }, {})
    for (const bp of ser.children || []) {
        if (bp.name !== "Desktop") continue
        function walk(n) {
            if (!n) return
            if (/LoadingScreen/i.test(n.name || "")) {
                delPrimary.push({ path: p.path, id: n.id, name: n.name })
            }
            for (const c of n.children || []) walk(c)
        }
        walk(bp)
    }
}

notes.push(`primaries: ${delPrimary.length}`)
if (delPrimary.length) {
    const r = await framer.agent.applyChanges(
        delPrimary.map((d) => `DEL ${d.id};`).join(NL),
        {},
    )
    notes.push(`DEL: ${r?.message}`)
}

// Sweep leftovers any BP
const left = []
for (const p of pages || []) {
    if (!p.path) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 4 }, {})
    for (const bp of ser.children || []) {
        function walk(n) {
            if (!n) return
            if (/LoadingScreen/i.test(n.name || "")) {
                left.push({ path: p.path, bp: bp.name, id: n.id })
            }
            for (const c of n.children || []) walk(c)
        }
        walk(bp)
    }
}
if (left.length) {
    const r2 = await framer.agent.applyChanges(
        left.map((x) => `DEL ${x.id};`).join(NL),
        {},
    )
    notes.push(`sweep ${left.length}: ${r2?.message}`)
}

// Final
const left2 = []
const pages2 = await framer.getNodesWithType("WebPageNode")
for (const p of pages2 || []) {
    if (!p.path) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 3 }, {})
    for (const bp of ser.children || []) {
        for (const c of bp.children || []) {
            if (/LoadingScreen/i.test(c.name || "")) {
                left2.push({ path: p.path, bp: bp.name, id: c.id })
            }
        }
    }
}

return { notes, deleted: delPrimary, leftAfter: left2 }

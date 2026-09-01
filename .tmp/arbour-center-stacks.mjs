const NL = String.fromCharCode(10)
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
const log = []

function walk(n, pred, acc = []) {
    if (!n) return acc
    if (pred(n)) acc.push(n)
    for (const c of n.children || []) walk(c, pred, acc)
    return acc
}

// How We Read → center horizontal distribution (all BPs)
for (const path of ["/neighbourhoods"]) {
    const p = pages.find((x) => x.path === path)
    const ser = await framer.agent.serialize({ id: p.id, depth: 5 }, {})
    for (const bp of ser.children || []) {
        const nodes = walk(bp, (n) => /How We Read A Place/i.test(n.name || ""))
        for (const n of nodes) {
            lines.push(`SET ${n.id} stackDistribution="center";`)
            log.push(`HowWeRead center ${bp.name} ${n.id}`)
        }
    }
}

// Full-bleed shells with 90% kids → stackAlignment center
for (const path of CONTENT) {
    const p = pages.find((x) => x.path === path)
    if (!p) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 3 }, {})
    for (const bp of ser.children || []) {
        for (const top of bp.children || []) {
            if (/Atmosphere|Nav|Cue|Footer/i.test(top.name || "")) continue
            const has90kid = (top.children || []).some(
                (c) =>
                    String(c.attributes?.width || "") === "90%" ||
                    String(c.attributes?.maxWidth || "") === "90%"
            )
            if (!has90kid) continue
            lines.push(`SET ${top.id} stackAlignment="center";`)
            log.push(`align ${path}|${bp.name}|${top.name}`)
        }
    }
}

// Nav Desktop variants: ensure top is centered in parent
const nav = (await framer.getNodesWithType("ComponentNode")).find((c) => c.name === "Nav")
if (nav) {
    const ser = await framer.agent.serialize({ id: nav.id, depth: 3 }, {})
    for (const v of ser.children || []) {
        lines.push(`SET ${v.id} stackAlignment="center";`)
        log.push(`Nav align ${v.name}`)
    }
}

const dsl = lines.join(NL)
const r = await framer.agent.applyChanges(dsl, {})
return {
    n: lines.length,
    log: log.slice(0, 50),
    errors: r.errors || null,
    warnings: (r.warnings || []).slice(0, 8),
}

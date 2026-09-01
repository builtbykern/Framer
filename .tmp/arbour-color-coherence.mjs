/**
 * Arbour color coherence review — all pages + smart components.
 * READ ONLY report.
 */
const fs = require("fs")

const styles = await framer.getColorStyles()
const styleById = Object.fromEntries(styles.map((s) => [s.id, s]))
const styleByName = Object.fromEntries(styles.map((s) => [s.name, s]))

function parse(s) {
    if (!s || typeof s !== "string") return null
    const tok = s.match(/token-([a-f0-9-]{36})/i)
    if (tok) {
        const st = styleById[tok[1]]
        return { kind: "token", id: tok[1], name: st?.name || "UNKNOWN", light: st?.light }
    }
    if (/variable-|var\(--variable/i.test(s)) return { kind: "variable", raw: s.slice(0, 60) }
    if (/gradient/i.test(s)) return { kind: "gradient", raw: s.slice(0, 80) }
    const rgba = s.match(
        /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/,
    )
    const hex = s.match(/#([0-9a-fA-F]{3,8})\b/)
    if (rgba) {
        return {
            kind: "raw",
            r: Math.round(+rgba[1]),
            g: Math.round(+rgba[2]),
            b: Math.round(+rgba[3]),
            a: rgba[4] != null ? +rgba[4] : 1,
            raw: s.slice(0, 80),
        }
    }
    if (hex) return { kind: "raw", hex: hex[1].toUpperCase(), raw: s.slice(0, 80) }
    return null
}

const COLOR_KEYS =
    /^(backgroundColor|fill|color|textColor|borderColor|shadowColor)$|\$control__.*(olor|ink|accent|scrim|background|fill)/i

const pages = await framer.getNodesWithType("WebPageNode")
const byPage = {}
const rawHits = []
const tokenUsage = {} // styleName -> count
const unknownTokens = []
const perPageTokens = {} // path -> Set of style names used

for (const p of pages || []) {
    if (!p.path) continue
    byPage[p.path] = { tokens: {}, raw: 0, gradient: 0, variable: 0 }
    perPageTokens[p.path] = new Set()

    const ser = await framer.agent.serialize({ id: p.id, depth: 8 }, {})
    for (const bp of ser.children || []) {
        function walk(n) {
            if (!n) return
            const a = n.attributes || {}
            for (const [k, v] of Object.entries(a)) {
                if (typeof v !== "string") continue
                if (!COLOR_KEYS.test(k) && !/(fill|backgroundColor|textColor|borderColor)/.test(k))
                    continue
                // skip non-color control blobs that happen to match
                if (k.startsWith("$control__") && v.startsWith("{")) continue

                const c = parse(v)
                if (!c) continue

                if (c.kind === "token") {
                    byPage[p.path].tokens[c.name] = (byPage[p.path].tokens[c.name] || 0) + 1
                    tokenUsage[c.name] = (tokenUsage[c.name] || 0) + 1
                    perPageTokens[p.path].add(c.name)
                    if (c.name === "UNKNOWN") {
                        unknownTokens.push({ path: p.path, bp: bp.name, id: n.id, name: n.name, k, idTok: c.id })
                    }
                } else if (c.kind === "raw") {
                    if (c.a === 0 && c.r === 0) continue
                    byPage[p.path].raw++
                    rawHits.push({
                        path: p.path,
                        bp: bp.name,
                        id: n.id,
                        name: n.name,
                        k,
                        raw: c.raw || c.hex,
                    })
                } else if (c.kind === "gradient") {
                    byPage[p.path].gradient++
                } else if (c.kind === "variable") {
                    byPage[p.path].variable++
                }
            }
            for (const c of n.children || []) walk(c)
        }
        walk(bp)
    }
}

// Smart components
const comps = await framer.getNodesWithType("ComponentNode")
const compReport = []
for (const comp of comps || []) {
    const ser = await framer.agent.serialize({ id: comp.id, depth: 8 }, {})
    const tokens = {}
    let raw = 0
    function walk(n) {
        if (!n) return
        const a = n.attributes || {}
        for (const [k, v] of Object.entries(a)) {
            if (typeof v !== "string") continue
            if (!/(fill|backgroundColor|textColor|borderColor|color)/.test(k)) continue
            const c = parse(v)
            if (!c) continue
            if (c.kind === "token") tokens[c.name] = (tokens[c.name] || 0) + 1
            if (c.kind === "raw" && !(c.a === 0 && c.r === 0)) raw++
        }
        for (const ch of n.children || []) walk(ch)
    }
    walk(ser)
    compReport.push({ name: comp.name, tokens, raw })
}

// Coherence heuristics
const contentPaths = [
    "/",
    "/properties",
    "/neighbourhoods",
    "/notes",
    "/about",
    "/contact",
    "/properties/:slug",
    "/notes/:slug",
]

const coreExpected = ["Paper", "Ink", "Racing", "Racing Deep", "Chartreuse"]
const missingCore = {}
for (const path of contentPaths) {
    const used = perPageTokens[path] || new Set()
    missingCore[path] = coreExpected.filter((n) => !used.has(n))
}

// Pages that use Ink Soft vs Ink 60 inconsistently for meta — just report counts
const softVs60 = {}
for (const path of contentPaths) {
    const t = byPage[path]?.tokens || {}
    softVs60[path] = { "Ink Soft": t["Ink Soft"] || 0, "Ink 60": t["Ink 60"] || 0, Olive: t.Olive || 0 }
}

const unusedStyles = styles.filter((s) => !tokenUsage[s.name]).map((s) => s.name)

const out = {
    collectedAt: new Date().toISOString(),
    styleCount: styles.length,
    styles: styles.map((s) => ({ name: s.name, light: s.light, uses: tokenUsage[s.name] || 0 })),
    byPage,
    rawHits,
    rawCount: rawHits.length,
    unknownTokens,
    unusedStyles,
    missingCore,
    softVs60,
    compReport,
    tokenUsageSorted: Object.entries(tokenUsage).sort((a, b) => b[1] - a[1]),
}

fs.writeFileSync(
    "/Users/noel/Desktop/Framer/.tmp/arbour-color-coherence.json",
    JSON.stringify(out, null, 2),
)

return {
    styleCount: styles.length,
    rawCount: rawHits.length,
    rawHits: rawHits.slice(0, 20),
    unusedStyles,
    missingCore,
    softVs60,
    byPageSummary: Object.fromEntries(
        Object.entries(byPage).map(([path, v]) => [
            path,
            { raw: v.raw, gradient: v.gradient, topTokens: Object.entries(v.tokens).sort((a, b) => b[1] - a[1]).slice(0, 6) },
        ]),
    ),
    unusedOrRare: styles
        .map((s) => ({ name: s.name, uses: tokenUsage[s.name] || 0 }))
        .filter((s) => s.uses < 3),
    tokenUsageSorted: Object.entries(tokenUsage).sort((a, b) => b[1] - a[1]),
}

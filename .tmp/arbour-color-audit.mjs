/**
 * Scan project for raw colors that should map to Arbour tokens.
 * READ ONLY inventory.
 */
const fs = require("fs")

const STYLES = await framer.getColorStyles()
const byId = Object.fromEntries(STYLES.map((s) => [s.id, s]))

function parseColor(s) {
    if (!s || typeof s !== "string") return null
    if (s.includes("token-") || s.includes("var(--token")) {
        const m = s.match(/token-([a-f0-9-]{36})/i)
        return { kind: "token", id: m ? m[1] : null, raw: s }
    }
    if (s.includes("variable-") || s.includes("var(--variable")) {
        return { kind: "variable", raw: s }
    }
    const hex = s.match(/#([0-9a-fA-F]{3,8})\b/)
    const rgba = s.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/)
    if (hex) {
        let h = hex[1]
        if (h.length === 3) h = h.split("").map((c) => c + c).join("")
        const r = parseInt(h.slice(0, 2), 16)
        const g = parseInt(h.slice(2, 4), 16)
        const b = parseInt(h.slice(4, 6), 16)
        const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1
        return { kind: "raw", r, g, b, a, raw: s, hex: h.slice(0, 6).toUpperCase() }
    }
    if (rgba) {
        return {
            kind: "raw",
            r: Math.round(Number(rgba[1])),
            g: Math.round(Number(rgba[2])),
            b: Math.round(Number(rgba[3])),
            a: rgba[4] != null ? Number(rgba[4]) : 1,
            raw: s,
            hex: null,
        }
    }
    return { kind: "other", raw: s }
}

function approxMatch(c) {
    if (!c || c.kind !== "raw") return null
    const near = (r, g, b, tol = 3) =>
        Math.abs(c.r - r) <= tol && Math.abs(c.g - g) <= tol && Math.abs(c.b - b) <= tol
    const a = Math.round(c.a * 100) / 100

    // Exact family matches from screenshot
    if (near(239, 233, 219)) return { style: "Cream On Dark", id: "537bd017-a079-4a2b-9afa-25208d628840", note: "EFE9DB" }
    if (near(252, 250, 244)) {
        if (a >= 0.98) return { style: "Paper", id: "d5b3c09d-0364-4ed0-8804-e56957faa275", note: "FCFAF4" }
        if (Math.abs(a - 0.72) < 0.03) return { style: "Paper 72", id: null, note: "need create", rgba: "rgba(252, 250, 244, 0.72)" }
        if (Math.abs(a - 0.45) < 0.03) return { style: "Paper 45", id: null, note: "need create", rgba: "rgba(252, 250, 244, 0.45)" }
        if (Math.abs(a - 0.22) < 0.03) return { style: "Paper 22", id: null, note: "need create", rgba: "rgba(252, 250, 244, 0.22)" }
        return { style: `Paper ~${Math.round(a * 100)}`, id: null, note: "need create", rgba: `rgba(252, 250, 244, ${a})` }
    }
    if (near(84, 98, 45)) return { style: "Olive", id: "a16d0333-6bd5-4d60-aa00-fac26447145d", note: "54622D" }
    if (near(21, 43, 30)) return { style: "Racing Deep", id: "9d3d6ca5-f3ad-4d88-afc8-fc5bce03bd04", note: "152B1E" }
    if (near(31, 61, 43)) return { style: "Racing", id: "fa6ec05f-9d2d-44ad-a813-6c56bf2b324e" }
    if (near(28, 27, 22)) {
        if (a >= 0.98) return { style: "Ink", id: "e2f9a9eb-668a-4021-80d9-b04413b5f392", note: "1C1B16" }
        if (Math.abs(a - 0.6) < 0.03) return { style: "Ink 60", id: "cf5bf9af-72f6-4da6-ad12-b9daaa07387b" }
        if (Math.abs(a - 0.55) < 0.03) return { style: "Ink Soft", id: "0bc68d0d-4c0b-4126-8cce-9425cb153f4e", note: "1C1B16 55%" }
        if (Math.abs(a - 0.18) < 0.02) return { style: "Ink 18", id: null, note: "need create", rgba: "rgba(28, 27, 22, 0.18)" }
        if (Math.abs(a - 0.15) < 0.02) return { style: "Ink 15", id: null, note: "need create", rgba: "rgba(28, 27, 22, 0.15)" }
        if (Math.abs(a - 0.12) < 0.02) return { style: "Ink 12", id: null, note: "need create", rgba: "rgba(28, 27, 22, 0.12)" }
        return { style: `Ink ~${Math.round(a * 100)}`, id: null, note: "need create", rgba: `rgba(28, 27, 22, ${a})` }
    }
    if (near(246, 242, 233)) return { style: "Parchment", id: "425191b0-a245-4f14-88c2-f7144ab54959" }
    if (near(214, 224, 74)) return { style: "Chartreuse", id: "db86917b-d19e-4fd7-8dc5-e260f1f35cb1" }
    if (c.r === 0 && c.g === 0 && c.b === 0 && a === 0) return { style: "Transparent", id: null, note: "skip 000000 0%" }
    return null
}

const COLOR_ATTRS = [
    "backgroundColor",
    "fill",
    "color",
    "textColor",
    "borderColor",
    "shadowColor",
]

const hits = []
const pages = await framer.getNodesWithType("WebPageNode")

for (const p of pages || []) {
    if (!p.path) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 8 }, {})
    for (const bp of ser.children || []) {
        function walk(n) {
            if (!n) return
            const a = n.attributes || {}
            for (const key of COLOR_ATTRS) {
                const val = a[key]
                if (!val || typeof val !== "string") continue
                // also nested in shadows etc skipped
                const parsed = parseColor(val)
                if (!parsed || parsed.kind !== "raw") continue
                if (parsed.a === 0 && parsed.r === 0) continue // transparent black noise
                const match = approxMatch(parsed)
                hits.push({
                    path: p.path,
                    bp: bp.name,
                    id: n.id,
                    name: n.name,
                    key,
                    raw: val.slice(0, 80),
                    hex: parsed.hex,
                    a: parsed.a,
                    match,
                })
            }
            // control colors
            for (const [k, v] of Object.entries(a)) {
                if (!k.startsWith("$control__")) continue
                if (typeof v !== "string") continue
                if (!/#|rgb/i.test(v)) continue
                if (/token-|variable-/i.test(v)) continue
                const parsed = parseColor(v)
                if (!parsed || parsed.kind !== "raw") continue
                if (parsed.a === 0 && parsed.r === 0) continue
                const match = approxMatch(parsed)
                hits.push({
                    path: p.path,
                    bp: bp.name,
                    id: n.id,
                    name: n.name,
                    key: k,
                    raw: v.slice(0, 80),
                    hex: parsed.hex,
                    a: parsed.a,
                    match,
                })
            }
            for (const c of n.children || []) walk(c)
        }
        walk(bp)
    }
}

// Also scan smart components
const comps = await framer.getNodesWithType("ComponentNode")
for (const comp of comps || []) {
    const ser = await framer.agent.serialize({ id: comp.id, depth: 8 }, {})
    function walk(n) {
        if (!n) return
        const a = n.attributes || {}
        for (const key of COLOR_ATTRS) {
            const val = a[key]
            if (!val || typeof val !== "string") continue
            const parsed = parseColor(val)
            if (!parsed || parsed.kind !== "raw") continue
            if (parsed.a === 0 && parsed.r === 0) continue
            const match = approxMatch(parsed)
            hits.push({
                path: `component:${comp.name}`,
                bp: "—",
                id: n.id,
                name: n.name,
                key,
                raw: val.slice(0, 80),
                hex: parsed.hex,
                a: parsed.a,
                match,
            })
        }
        for (const c of n.children || []) walk(c)
    }
    walk(ser)
}

// Aggregate
const buckets = {}
for (const h of hits) {
    const label = h.match
        ? `${h.match.style}${h.match.id ? "" : " (CREATE)"}`
        : `UNMAPPED ${h.hex || h.raw}`
    if (!buckets[label]) buckets[label] = { count: 0, samples: [], match: h.match }
    buckets[label].count++
    if (buckets[label].samples.length < 5) buckets[label].samples.push(h)
}

const out = {
    styles: STYLES.map((s) => ({ id: s.id, name: s.name, path: s.path, light: s.light })),
    hitCount: hits.length,
    buckets,
    linkable: hits.filter((h) => h.match?.id),
    needCreate: hits.filter((h) => h.match && !h.match.id && h.match.note !== "skip 000000 0%"),
    unmapped: hits.filter((h) => !h.match),
}

fs.writeFileSync(
    "/Users/noel/Desktop/Framer/.tmp/arbour-color-audit.json",
    JSON.stringify(out, null, 2),
)

return {
    styleCount: STYLES.length,
    hitCount: hits.length,
    buckets: Object.fromEntries(
        Object.entries(buckets).map(([k, v]) => [k, v.count]),
    ),
    needCreateUnique: [
        ...new Map(
            hits
                .filter((h) => h.match && !h.match.id && h.match.rgba)
                .map((h) => [h.match.style, h.match]),
        ).values(),
    ],
    unmappedSample: hits.filter((h) => !h.match).slice(0, 20),
}

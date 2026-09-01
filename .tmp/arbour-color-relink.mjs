/**
 * Arbour palette pass:
 * 1) Create missing opacity styles (Paper 72/45/22, Ink 18/15/12)
 * 2) Relink raw fills/textColors to existing + new tokens
 * 3) Snap near-opacities to nearest named style
 */
const fs = require("fs")
const NL = String.fromCharCode(10)

const EXISTING = {
    Paper: "d5b3c09d-0364-4ed0-8804-e56957faa275",
    Parchment: "425191b0-a245-4f14-88c2-f7144ab54959",
    Ink: "e2f9a9eb-668a-4021-80d9-b04413b5f392",
    "Ink 60": "cf5bf9af-72f6-4da6-ad12-b9daaa07387b",
    "Ink Soft": "0bc68d0d-4c0b-4126-8cce-9425cb153f4e",
    Racing: "fa6ec05f-9d2d-44ad-a813-6c56bf2b324e",
    "Racing Deep": "9d3d6ca5-f3ad-4d88-afc8-fc5bce03bd04",
    "Cream On Dark": "537bd017-a079-4a2b-9afa-25208d628840",
    Olive: "a16d0333-6bd5-4d60-aa00-fac26447145d",
    Chartreuse: "db86917b-d19e-4fd7-8dc5-e260f1f35cb1",
    Stone: "8e108d61-e166-4e15-8c30-69c8865f3f4a",
    Oxblood: "3a86a4b6-e73d-409f-8eaa-4f155132899b",
}

function tok(id) {
    return `var(--token-${id})`
}

// --- create missing styles ---
const toCreate = [
    { name: "Arbour/Paper 72", light: "rgba(252, 250, 244, 0.72)", key: "Paper 72" },
    { name: "Arbour/Paper 45", light: "rgba(252, 250, 244, 0.45)", key: "Paper 45" },
    { name: "Arbour/Paper 22", light: "rgba(252, 250, 244, 0.22)", key: "Paper 22" },
    { name: "Arbour/Ink 18", light: "rgba(28, 27, 22, 0.18)", key: "Ink 18" },
    { name: "Arbour/Ink 15", light: "rgba(28, 27, 22, 0.15)", key: "Ink 15" },
    { name: "Arbour/Ink 12", light: "rgba(28, 27, 22, 0.12)", key: "Ink 12" },
]

const created = {}
const existingStyles = await framer.getColorStyles()
for (const s of existingStyles) {
    const short = s.name
    if (toCreate.some((t) => t.key === short || s.path?.endsWith("/" + t.key))) {
        created[short] = s.id
    }
}

for (const t of toCreate) {
    if (created[t.key]) continue
    const style = await framer.createColorStyle({
        name: t.name,
        light: t.light,
        dark: t.light,
    })
    created[t.key] = style.id
}

const IDS = { ...EXISTING, ...created }

function parseRaw(s) {
    if (!s || typeof s !== "string") return null
    if (/token-|variable-/i.test(s)) return null
    const rgba = s.match(
        /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/,
    )
    const hex = s.match(/#([0-9a-fA-F]{6})\b/)
    if (rgba) {
        return {
            r: Math.round(Number(rgba[1])),
            g: Math.round(Number(rgba[2])),
            b: Math.round(Number(rgba[3])),
            a: rgba[4] != null ? Number(rgba[4]) : 1,
        }
    }
    if (hex) {
        const h = hex[1]
        return {
            r: parseInt(h.slice(0, 2), 16),
            g: parseInt(h.slice(2, 4), 16),
            b: parseInt(h.slice(4, 6), 16),
            a: 1,
        }
    }
    return null
}

function near(c, r, g, b, tol = 3) {
    return Math.abs(c.r - r) <= tol && Math.abs(c.g - g) <= tol && Math.abs(c.b - b) <= tol
}

function resolve(c) {
    const a = c.a
    if (near(c, 239, 233, 219)) return IDS["Cream On Dark"]
    if (near(c, 246, 242, 233)) return IDS.Parchment
    if (near(c, 231, 223, 206)) return IDS.Stone
    if (near(c, 84, 98, 45)) return IDS.Olive
    if (near(c, 21, 43, 30)) return IDS["Racing Deep"]
    if (near(c, 31, 61, 43)) return IDS.Racing
    if (near(c, 214, 224, 74)) return IDS.Chartreuse
    if (near(c, 94, 43, 38)) return IDS.Oxblood
    if (c.r === 255 && c.g === 255 && c.b === 255 && a >= 0.98) return IDS.Paper

    if (near(c, 252, 250, 244)) {
        if (a >= 0.98) return IDS.Paper
        if (a >= 0.58) return IDS["Paper 72"] // 72 and near
        if (a >= 0.32) return IDS["Paper 45"]
        if (a >= 0.1) return IDS["Paper 22"] // includes ~14
        return IDS["Paper 22"] // ~4 too — still Paper family
    }

    if (near(c, 28, 27, 22)) {
        if (a >= 0.95) return IDS.Ink
        if (a >= 0.75) return IDS.Ink // ~90
        if (a >= 0.62) return IDS["Ink 60"] // ~65
        if (a >= 0.52) return IDS["Ink Soft"] // 55
        if (a >= 0.48) return IDS["Ink Soft"]
        if (a >= 0.19) return IDS["Ink 18"] // 18–20
        if (a >= 0.165) return IDS["Ink 18"]
        if (a >= 0.135) return IDS["Ink 15"]
        if (a >= 0.1) return IDS["Ink 12"]
        return IDS["Ink 12"] // ~8
    }

    return null
}

const COLOR_ATTRS = ["backgroundColor", "fill", "color", "textColor", "borderColor"]
const lines = []
const notes = []
const seen = new Set()

function maybeSet(id, key, val) {
    const c = parseRaw(val)
    if (!c) return
    if (c.a === 0 && c.r === 0 && c.g === 0 && c.b === 0) return // transparent
    // skip gradients
    if (/gradient/i.test(val)) return
    const tokenId = resolve(c)
    if (!tokenId) return
    const sig = `${id}|${key}|${tokenId}`
    if (seen.has(sig)) return
    seen.add(sig)
    lines.push(`SET ${id} ${key}="${tok(tokenId)}";`)
}

const pages = await framer.getNodesWithType("WebPageNode")
for (const p of pages || []) {
    if (!p.path) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 8 }, {})
    for (const bp of ser.children || []) {
        function walk(n) {
            if (!n) return
            const a = n.attributes || {}
            for (const key of COLOR_ATTRS) {
                if (a[key]) maybeSet(n.id, key, a[key])
            }
            for (const [k, v] of Object.entries(a)) {
                if (!k.startsWith("$control__")) continue
                if (typeof v !== "string") continue
                if (!/#|rgb/i.test(v) || /token-|variable-|gradient/i.test(v)) continue
                maybeSet(n.id, k, v)
            }
            for (const c of n.children || []) walk(c)
        }
        walk(bp)
    }
}

const comps = await framer.getNodesWithType("ComponentNode")
for (const comp of comps || []) {
    const ser = await framer.agent.serialize({ id: comp.id, depth: 8 }, {})
    function walk(n) {
        if (!n) return
        const a = n.attributes || {}
        for (const key of COLOR_ATTRS) {
            if (a[key]) maybeSet(n.id, key, a[key])
        }
        for (const c of n.children || []) walk(c)
    }
    walk(ser)
}

notes.push(`created styles: ${JSON.stringify(created)}`)
notes.push(`SET lines: ${lines.length}`)

// Apply in chunks to avoid huge payloads
const chunkSize = 80
const results = []
for (let i = 0; i < lines.length; i += chunkSize) {
    const chunk = lines.slice(i, i + chunkSize)
    const r = await framer.agent.applyChanges(chunk.join(NL), {})
    results.push({ i, n: chunk.length, message: r?.message || r })
}

fs.writeFileSync(
    "/Users/noel/Desktop/Framer/.tmp/arbour-color-relink.json",
    JSON.stringify({ created, IDS, lineCount: lines.length, sample: lines.slice(0, 30), results }, null, 2),
)

return { created, lineCount: lines.length, results, sample: lines.slice(0, 15) }

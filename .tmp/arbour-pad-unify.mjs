/**
 * Unify section paddings to Arbour scale — section shells only.
 * Desktop: L 128/48, M 96/48, S 64/48, S_tight 32/48; gutter 48
 * Tablet:  L 96/40,  M 72/40,  S 48/40; gutter 40 (site majority)
 * Phone:   L 64/16,  M 48/16,  S 40/16; gutter 16
 * Nested rows with 0 horizontal keep 0 horizontal; only snap vertical.
 */
const fs = require("fs")
const NL = String.fromCharCode(10)

const GUTTER = { Desktop: 48, Tablet: 40, Phone: 16 }
const VSTEPS = {
    Desktop: [0, 32, 64, 96, 128],
    Tablet: [0, 24, 48, 72, 96],
    Phone: [0, 24, 40, 48, 64],
}

function parsePad(pad) {
    const parts = String(pad).trim().split(/\s+/)
    let t, r, b, l
    if (parts.length === 1) t = r = b = l = parts[0]
    else if (parts.length === 2) {
        t = b = parts[0]
        r = l = parts[1]
    } else if (parts.length === 3) {
        t = parts[0]
        r = l = parts[1]
        b = parts[2]
    } else {
        ;[t, r, b, l] = parts
    }
    const px = (x) => {
        const m = String(x).match(/([\d.]+)px/)
        return m ? Number(m[1]) : 0
    }
    return { t: px(t), r: px(r), b: px(b), l: px(l), raw: pad }
}

function near(v, steps) {
    return steps.reduce((best, s) => (Math.abs(s - v) < Math.abs(best - v) ? s : best), steps[0])
}

function format(t, r, b, l) {
    if (t === b && r === l && t === r) return `${t}px`
    if (t === b && r === l) return `${t}px ${r}px`
    return `${t}px ${r}px ${b}px ${l}px`
}

function remap(bp, pad, depth, name) {
    const p = parsePad(pad)
    const g = GUTTER[bp]
    const steps = VSTEPS[bp]
    const nt = near(p.t, steps)
    const nb = near(p.b, steps)
    const horizZero = p.r === 0 && p.l === 0
    // Nested (depth>=3) or item rows: keep horiz 0 if already 0
    const keepHoriz0 =
        horizZero &&
        (depth >= 3 ||
            /row|item|header|panel|copy|column|deck|meta|list/i.test(name || ""))
    if (keepHoriz0) {
        if (nt === p.t && nb === p.b) return null // already ok vertically enough? still snap
        const next = format(nt, 0, nb, 0)
        return next === pad ? null : next
    }
    // Section shells: enforce gutter
    const next = format(nt, g, nb, g)
    return next === pad ? null : next
}

function isSectionish(n, depth) {
    if (!n || n.type !== "FrameNode") return false
    const name = n.name || ""
    if (!name || /^(Atmosphere|Desktop|Tablet|Phone)$/.test(name)) return false
    if (depth <= 2) return true
    return /section|hero|journal|portfolio|territor|bottom|recognition|testimonial|contact|chapter|beat|enquiry|gallery|particular|setting|manifesto|opening|pause|process|content|wrap|band|grid|cta|row|item|header|panel|column/i.test(
        name,
    )
}

const pages = await framer.getNodesWithType("WebPageNode")
const jobs = []

for (const p of pages || []) {
    if (!p.path || p.path === "/404") continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 6 }, {})
    for (const bpNode of ser.children || []) {
        const bp = bpNode.name
        if (!GUTTER[bp]) continue
        function walk(n, depth) {
            if (!n || depth > 5) return
            if (isSectionish(n, depth) && n.attributes?.padding) {
                const target = remap(bp, n.attributes.padding, depth, n.name)
                if (target) {
                    jobs.push({
                        path: p.path,
                        bp,
                        id: n.id,
                        name: n.name,
                        depth,
                        from: n.attributes.padding,
                        to: target,
                    })
                }
            }
            for (const c of n.children || []) walk(c, depth + 1)
        }
        walk(bpNode, 0)
    }
}

// Dedupe by id (prefer primary / last write wins)
const byId = new Map()
for (const j of jobs) byId.set(j.id, j)
const unique = [...byId.values()]

fs.writeFileSync(
    "/Users/noel/Desktop/Framer/.tmp/arbour-padding-remap.json",
    JSON.stringify(unique, null, 2),
)

const results = []
const CHUNK = 35
for (let i = 0; i < unique.length; i += CHUNK) {
    const chunk = unique.slice(i, i + CHUNK)
    const lines = chunk.map((j) => `SET ${j.id} padding="${j.to}";`)
    try {
        const r = await framer.agent.applyChanges(lines.join(NL), {})
        results.push({ i, n: chunk.length, errors: r.errors || [] })
    } catch (e) {
        results.push({ i, n: chunk.length, err: String(e.message || e) })
    }
}

console.log(
    JSON.stringify(
        {
            jobs: unique.length,
            sample: unique.slice(0, 25),
            byBp: unique.reduce((a, j) => {
                a[j.bp] = (a[j.bp] || 0) + 1
                return a
            }, {}),
            apply: results,
        },
        null,
        2,
    ),
)

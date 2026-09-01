/**
 * Fix: restore 0 horizontal padding where unify wrongly injected gutters.
 * Re-read inventory from remap file "from" fields, or re-serialize and fix.
 */
const NL = String.fromCharCode(10)
const remap = JSON.parse(
    require("fs").readFileSync(
        "/Users/noel/Desktop/Framer/.tmp/arbour-padding-remap.json",
        "utf8",
    ),
)

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
    } else [t, r, b, l] = parts
    const px = (x) => {
        const m = String(x).match(/([\d.]+)px/)
        return m ? Number(m[1]) : 0
    }
    return { t: px(t), r: px(r), b: px(b), l: px(l) }
}

function format(t, r, b, l) {
    if (t === b && r === l && t === r) return `${t}px`
    if (t === b && r === l) return `${t}px ${r}px`
    return `${t}px ${r}px ${b}px ${l}px`
}

const VSTEPS = {
    Desktop: [0, 32, 64, 96, 128],
    Tablet: [0, 24, 48, 72, 96],
    Phone: [0, 24, 40, 48, 64],
}
function near(v, steps) {
    return steps.reduce((best, s) => (Math.abs(s - v) < Math.abs(best - v) ? s : best), steps[0])
}

const fixes = []
for (const j of remap) {
    const from = parsePad(j.from)
    const to = parsePad(j.to)
    // If original had 0 horizontal but target injected gutter
    if (from.r === 0 && from.l === 0 && (to.r !== 0 || to.l !== 0)) {
        const steps = VSTEPS[j.bp]
        const nt = near(from.t, steps)
        const nb = near(from.b, steps)
        const corrected = format(nt, 0, nb, 0)
        fixes.push({ ...j, corrected })
    }
}

const results = []
const CHUNK = 40
for (let i = 0; i < fixes.length; i += CHUNK) {
    const chunk = fixes.slice(i, i + CHUNK)
    const lines = chunk.map((j) => `SET ${j.id} padding="${j.corrected}";`)
    const r = await framer.agent.applyChanges(lines.join(NL), {})
    results.push({ i, n: chunk.length, errors: r.errors || [] })
}

console.log(
    JSON.stringify(
        {
            fixes: fixes.length,
            sample: fixes.slice(0, 15).map((f) => ({
                path: f.path,
                bp: f.bp,
                name: f.name,
                from: f.from,
                wrongTo: f.to,
                corrected: f.corrected,
            })),
            apply: results,
        },
        null,
        2,
    ),
)

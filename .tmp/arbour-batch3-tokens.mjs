/**
 * Batch 3: opaque hard brand colors → tokens; leave rgba overlays
 */
const NL = String.fromCharCode(10)
const PAPER = "var(--token-d5b3c09d-0364-4ed0-8804-e56957faa275)"
const PARCHMENT = "var(--token-425191b0-a245-4f14-88c2-f7144ab54959)"
const INK = "var(--token-e2f9a9eb-668a-4021-80d9-b04413b5f392)"
const OLIVE = "var(--token-a16d0333-6bd5-4d60-aa00-fac26447145d)"
const CHARTREUSE = "var(--token-db86917b-d19e-4fd7-8dc5-e260f1f35cb1)"
const RACING = "var(--token-fa6ec05f-9d2d-44ad-a813-6c56bf2b324e)"
const RACING_DEEP = "var(--token-9d3d6ca5-f3ad-4d88-afc8-fc5bce03bd04)"
const STONE = "var(--token-8e108d61-e166-4e15-8c30-69c8865f3f4a)"

function norm(s) {
    return String(s || "")
        .toLowerCase()
        .replace(/\s+/g, "")
}

function mapOpaque(val) {
    const v = norm(val)
    if (!v || v.includes("var(--token") || v.includes("rgba(") || v.includes("gradient")) return null
    // hex
    if (v === "#fcfaf4" || v === "rgb(252,250,244)") return PAPER
    if (v === "#f6f2e9" || v === "rgb(246,242,233)") return PARCHMENT
    if (v === "#efe9db" || v === "rgb(239,233,219)") return STONE
    if (v === "#1c1b16" || v === "rgb(28,27,22)") return INK
    if (v === "#54622d" || v === "rgb(84,98,45)") return OLIVE
    if (v === "#d6e04a" || v === "rgb(214,224,74)") return CHARTREUSE
    if (v === "#152b1e" || v === "rgb(21,43,30)") return RACING
    if (v === "#0a160f" || v === "rgb(10,22,15)") return RACING_DEEP
    return null
}

const pages = await framer.getNodesWithType("WebPageNode")
const jobs = []
const COLOR_KEYS = ["fill", "textColor", "borderColor", "backgroundColor"]

for (const page of pages || []) {
    if (!page.path || page.path === "/404") continue
    const ser = await framer.agent.serialize({ id: page.id, depth: 10 }, {})
    function walk(n) {
        if (!n) return
        // skip replicas? primary only to avoid triple apply — still need tablet/phone overrides
        const a = n.attributes || {}
        for (const key of COLOR_KEYS) {
            const val = a[key]
            if (typeof val !== "string") continue
            const tok = mapOpaque(val)
            if (tok && n.id) {
                jobs.push({ path: page.path, id: n.id, key, from: val.slice(0, 40), to: tok })
            }
        }
        for (const c of n.children || []) walk(c)
    }
    walk(ser)
}

// Dedupe by id+key
const seen = new Set()
const unique = []
for (const j of jobs) {
    const k = j.id + "|" + j.key
    if (seen.has(k)) continue
    seen.add(k)
    unique.push(j)
}

console.log(
    JSON.stringify(
        {
            total: unique.length,
            sample: unique.slice(0, 20),
            byPath: unique.reduce((acc, j) => {
                acc[j.path] = (acc[j.path] || 0) + 1
                return acc
            }, {}),
        },
        null,
        2,
    ),
)

const results = []
const CHUNK = 40
for (let i = 0; i < unique.length; i += CHUNK) {
    const chunk = unique.slice(i, i + CHUNK)
    const lines = chunk.map((j) => `SET ${j.id} ${j.key}="${j.to}";`)
    try {
        const r = await framer.agent.applyChanges(lines.join(NL), {})
        results.push({ i, n: chunk.length, errors: r.errors || [] })
    } catch (e) {
        results.push({ i, n: chunk.length, err: String(e.message || e) })
    }
}

// Notes FX residual probe
const notes = (pages || []).find((p) => p.path === "/notes")
const nser = await framer.agent.serialize({ id: notes.id, depth: 3 }, {})
const desk = (nser.children || []).find((c) => c.name === "Desktop")
const tops = (desk?.children || []).map((c) => c.name)
const atm = (desk?.children || []).find((c) => c.name === "Atmosphere")
const atmKids = (atm?.children || []).map((c) => c.name || c.$componentDisplayName)

console.log(JSON.stringify({ apply: results, notesTops: tops, atmKids }, null, 2))

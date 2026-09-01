/**
 * Batch 2b stepwise with guards
 */
const NL = String.fromCharCode(10)
const pages = await framer.getNodesWithType("WebPageNode")
const byPath = {}
for (const p of pages || []) if (p.path) byPath[p.path] = p

async function apply(label, lines, opts = {}) {
    if (!lines.length) return { label, skipped: true }
    const dsl = lines.join(NL)
    try {
        const r = await framer.agent.applyChanges(dsl, opts.pagePath ? { pagePath: opts.pagePath } : {})
        const errs = r.errors || []
        const errObj = errs && !Array.isArray(errs) ? errs : null
        return {
            label,
            ok: Array.isArray(errs) ? errs.length === 0 : !errObj || !Object.keys(errObj).length,
            errors: errs,
        }
    } catch (e) {
        return { label, ok: false, err: String(e.message || e) }
    }
}

const results = []

// 1) MOVE shell to front
for (const path of ["/", "/notes", "/neighbourhoods"]) {
    try {
        const page = byPath[path]
        if (!page) {
            results.push({ label: "move-" + path, ok: false, err: "no page" })
            continue
        }
        const ser = await framer.agent.serialize({ id: page.id, depth: 2 }, {})
        const desk = (ser.children || []).find((c) => c.name === "Desktop")
        if (!desk) {
            results.push({ label: "move-" + path, ok: false, err: "no desk" })
            continue
        }
        const byName = {}
        for (const c of desk.children || []) if (c.name) byName[c.name] = c
        const lines = []
        let idx = 0
        for (const n of ["Arbour_LoadingScreen", "Arbour_SmoothScroll", "Atmosphere"]) {
            if (byName[n] && byName[n].id) {
                lines.push(`MOVE ${byName[n].id} parent="${desk.id}" index="${idx}";`)
                idx++
            }
        }
        results.push(await apply("move-" + path, lines, { pagePath: path }))
    } catch (e) {
        results.push({ label: "move-" + path, ok: false, err: String(e.message || e) })
    }
}

console.log(JSON.stringify({ phase: "move", results }, null, 2))

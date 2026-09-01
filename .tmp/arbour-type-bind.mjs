/**
 * Bind clear inline typography to Arbour text style presets.
 * Only nodes WITHOUT textStylePreset, matching font+size of a preset.
 * Skip BP replicas (ids containing long prefixes) — set on primary Desktop ids when possible;
 * actually Framer BP replicas need their own SET if detached — set all matching.
 */
const NL = String.fromCharCode(10)

const MAP = [
    { font: "Inter", size: "16px", preset: "Arbour/Body" },
    { font: "Inter", size: "18px", preset: "Arbour/Body" }, // close body — keep size override if needed
    { font: "Space Mono", size: "11px", preset: "Arbour/Meta" },
    { font: "Fraunces", size: "21px", preset: "Arbour/Subhead" },
    { font: "Fraunces", size: "48px", preset: "Arbour/Heading" },
    { font: "Fraunces", size: "84px", preset: "Arbour/Display" },
    { font: "Fraunces", size: "24px", preset: "Arbour/Price" },
]

function matchPreset(fontName, fontSize) {
    const size = String(fontSize || "")
    for (const m of MAP) {
        if (fontName === m.font && size === m.size) return m.preset
    }
    return null
}

const pages = await framer.getNodesWithType("WebPageNode")
const jobs = []

for (const p of pages || []) {
    if (!p.path || p.path === "/404") continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 10 }, {})
    for (const bp of ser.children || []) {
        function walk(n) {
            if (!n) return
            if (n.type === "RichTextNode" || n.type === "TextNode") {
                const a = n.attributes || {}
                if (a.textStylePreset) {
                    /* already bound */
                } else {
                    const preset = matchPreset(a.fontName, a.fontSize)
                    if (preset) {
                        // Skip Display Contact pages special cases — Contact hero uses Display Contact preset ideally
                        const isContactDisplay =
                            p.path === "/contact" &&
                            preset === "Arbour/Display" &&
                            /hero|display|title|h1/i.test(n.name || "")
                        const target = isContactDisplay ? "Arbour/Display Contact" : preset
                        jobs.push({
                            id: n.id,
                            path: p.path,
                            bp: bp.name,
                            name: n.name || "",
                            from: `${a.fontName} ${a.fontSize}`,
                            to: target,
                        })
                    }
                }
            }
            for (const c of n.children || []) walk(c)
        }
        walk(bp)
    }
}

// Dedupe by id
const byId = new Map()
for (const j of jobs) byId.set(j.id, j)
const unique = [...byId.values()]

// Cap: apply in chunks; skip Inter 18→Body if it would fight Price (Price is Fraunces 24)
const apply = unique.filter((j) => !(j.from === "Inter 18px" && /price/i.test(j.name)))

const results = []
const CHUNK = 40
for (let i = 0; i < apply.length; i += CHUNK) {
    const chunk = apply.slice(i, i + CHUNK)
    const lines = chunk.map((j) => `SET ${j.id} textStylePreset="${j.to}";`)
    try {
        const r = await framer.agent.applyChanges(lines.join(NL), {})
        results.push({ i, n: chunk.length, msg: r.message || "ok", errors: r.errors || null })
    } catch (e) {
        results.push({ i, n: chunk.length, err: String(e.message || e) })
    }
}

return {
    found: unique.length,
    applied: apply.length,
    sample: apply.slice(0, 30).map((j) => ({
        path: j.path,
        bp: j.bp,
        name: j.name,
        from: j.from,
        to: j.to,
    })),
    byPreset: apply.reduce((a, j) => {
        a[j.to] = (a[j.to] || 0) + 1
        return a
    }, {}),
    results,
}

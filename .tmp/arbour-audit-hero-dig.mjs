/**
 * Dig into hero air candidates that survived pass-n:
 * About Opening, Notes, Journal detail, Neighbourhoods, Property slug, Home inner.
 * Also list hardButtons + Noise matrix Desktop.
 * READ ONLY.
 */
const TARGETS = [
    { path: "/about", names: /Beat 1|Opening Copy|Opening Image|Portrait/i },
    { path: "/notes", names: /Notes Hero|Hero Copy|Journal/i },
    { path: "/notes/:slug", names: /Journal Hero|Hero/i },
    { path: "/neighbourhoods", names: /Hero|Opening|Intro/i },
    { path: "/properties/:slug", names: /Hero|Opening|Intro|Chapter/i },
    { path: "/", names: /Hero Section|Hero Copy|Hero Content|Hero Text/i },
    { path: "/contact", names: /Contact Hero|Hero Copy/i },
    { path: "/properties", names: /Properties Hero|Hero Copy/i },
]

function parsePad(p) {
    if (!p || typeof p !== "string") return null
    const parts = p.trim().split(/\s+/)
    const n = (x) => {
        const m = String(x).match(/^([\d.]+)/)
        return m ? Number(m[1]) : null
    }
    if (parts.length >= 4)
        return { t: n(parts[0]), r: n(parts[1]), b: n(parts[2]), l: n(parts[3]), raw: p }
    if (parts.length === 1) {
        const v = n(parts[0])
        return { t: v, r: v, b: v, l: v, raw: p }
    }
    return { raw: p }
}

const pages = await framer.getNodesWithType("WebPageNode")
const report = []

for (const t of TARGETS) {
    const p = pages.find((x) => x.path === t.path)
    if (!p) {
        report.push({ path: t.path, error: "missing" })
        continue
    }
    const ser = await framer.agent.serialize({ id: p.id, depth: 6 }, {})
    const hits = []
    for (const bp of ser.children || []) {
        function walk(n, depth) {
            if (!n || depth > 6) return
            if (t.names.test(n.name || "")) {
                const a = n.attributes || {}
                hits.push({
                    bp: bp.name,
                    id: n.id,
                    name: n.name,
                    depth,
                    padding: a.padding || null,
                    pad: parsePad(a.padding),
                    maxWidth: a.maxWidth || null,
                    gap: a.gap || null,
                    fill: a.fill ? String(a.fill).slice(0, 60) : null,
                    bg: a.backgroundColor ? String(a.backgroundColor).slice(0, 50) : null,
                })
            }
            for (const c of n.children || []) walk(c, depth + 1)
        }
        walk(bp, 0)
    }
    report.push({ path: t.path, hits })
}

// hard button scan light
const hard = []
for (const path of ["/about", "/contact", "/notes", "/"]) {
    const p = pages.find((x) => x.path === path)
    if (!p) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 7 }, {})
    for (const bp of ser.children || []) {
        if (bp.name !== "Desktop") continue
        function walk(n) {
            if (!n) return
            const a = n.attributes || {}
            const name = n.name || a.$componentDisplayName || ""
            if (/Button|Subscribe|Enquire|Primary/i.test(name)) {
                const bg = String(a.backgroundColor || a.$control__background || a.$control__color || "")
                hard.push({
                    path,
                    id: n.id,
                    name,
                    bg: bg.slice(0, 100) || null,
                    ink: a.$control__ink ? String(a.$control__ink).slice(0, 60) : null,
                    fill: a.$control__fill ? String(a.$control__fill).slice(0, 60) : null,
                })
            }
            for (const c of n.children || []) walk(c)
        }
        walk(bp)
    }
}

return { report, hardButtonsDesktop: hard }

/**
 * Matrix: heroes + CTA blocks across Arbour pages (D/T/P).
 */
const fs = require("fs")

const HERO_RE =
    /hero|beat 1|portrait stage|article hero|property hero|contact hero|opening note|journal(?! manifesto)/i
const CTA_RE =
    /enquiry|cta|journal(?! text|hero|manifesto)|continue your|more from|private consultation|write privately|primary ?button/i

const pages = await framer.getNodesWithType("WebPageNode")
const heroes = []
const ctas = []
const buttons = []

function padOf(n) {
    return n.attributes?.padding || null
}
function gapOf(n) {
    return n.attributes?.gap || null
}
function maxW(n) {
    return n.attributes?.maxWidth || null
}

function childNames(n, limit = 8) {
    return (n.children || [])
        .slice(0, limit)
        .map((c) => c.name || c.type || "?")
}

function walk(n, depth, path, bp, ctx) {
    if (!n || depth > 6) return
    const name = n.name || ""
    const type = n.type || ""

    if (type === "FrameNode" && depth <= 2 && HERO_RE.test(name)) {
        heroes.push({
            path,
            bp,
            id: n.id,
            name,
            depth,
            padding: padOf(n),
            gap: gapOf(n),
            maxWidth: maxW(n),
            children: childNames(n),
        })
    }

    if (type === "FrameNode" && depth <= 2 && CTA_RE.test(name)) {
        ctas.push({
            path,
            bp,
            id: n.id,
            name,
            depth,
            padding: padOf(n),
            gap: gapOf(n),
            maxWidth: maxW(n),
            children: childNames(n),
        })
    }

    // Component instances that look like buttons / CTAs
    if (type === "ComponentInstanceNode" || type === "CodeComponentNode") {
        const display = n.attributes?.$componentDisplayName || n.name || ""
        const compId = n.attributes?.componentId || n.attributes?.codeFileId || null
        if (/button|cta|enquiry|underline|primary/i.test(display + name)) {
            const controls = {}
            for (const [k, v] of Object.entries(n.attributes || {})) {
                if (k.startsWith("$control") || k.startsWith("control") || /label|text|title|href|link|variant|size|icon/i.test(k)) {
                    if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
                        controls[k] = v
                    }
                }
            }
            buttons.push({
                path,
                bp,
                id: n.id,
                name,
                display,
                type,
                compId,
                controls,
                parentHint: ctx.parentName || null,
            })
        }
    }

    const nextCtx = { parentName: name || ctx.parentName }
    for (const c of n.children || []) walk(c, depth + 1, path, bp, nextCtx)
}

for (const p of pages || []) {
    if (!p.path || p.path === "/404") continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 7 }, {})
    for (const bp of ser.children || []) {
        walk(bp, 0, p.path, bp.name, {})
    }
}

// Deduplicate CTA "Journal" that's actually a full journal section vs strip — keep all, analyze later
fs.writeFileSync(
    "/Users/noel/Desktop/Framer/.tmp/arbour-cta-hero-matrix.json",
    JSON.stringify({ collectedAt: new Date().toISOString(), heroes, ctas, buttons }, null, 2),
)

// Summaries
function groupKey(rows, keys) {
    const m = {}
    for (const r of rows) {
        const k = keys.map((x) => r[x]).join("|")
        m[k] = (m[k] || 0) + 1
    }
    return Object.entries(m).sort((a, b) => b[1] - a[1])
}

console.log(
    JSON.stringify(
        {
            heroes: heroes.length,
            ctas: ctas.length,
            buttons: buttons.length,
            heroNames: [...new Set(heroes.map((h) => h.path + " · " + h.name))],
            ctaNames: [...new Set(ctas.map((c) => c.path + " · " + c.name))],
            buttonDisplays: groupKey(buttons, ["display"]).slice(0, 20),
            out: ".tmp/arbour-cta-hero-matrix.json",
        },
        null,
        2,
    ),
)

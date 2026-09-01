/**
 * Inventory section gaps + text style usage across Arbour pages.
 */
const fs = require("fs")
const pages = await framer.getNodesWithType("WebPageNode")
const gapRows = []
const typeRows = []
const styleIds = new Map()

function isSectionish(n, depth) {
    if (!n || n.type !== "FrameNode") return false
    const name = n.name || ""
    if (!name || /^(Atmosphere|Desktop|Tablet|Phone)$/.test(name)) return false
    if (depth <= 2) return true
    return /section|hero|journal|portfolio|territor|bottom|recognition|testimonial|contact|chapter|beat|enquiry|gallery|particular|setting|manifesto|opening|pause|process|content|wrap|band|grid|cta|row|header|column|stack|copy|meta/i.test(
        name,
    )
}

function walkGaps(n, depth, path, bp) {
    if (!n || depth > 4) return
    if (isSectionish(n, depth)) {
        const gap = n.attributes?.gap
        if (gap != null && gap !== "") {
            gapRows.push({
                path,
                bp,
                id: n.id,
                name: n.name,
                depth,
                gap: String(gap),
                layout: n.attributes?.layout || null,
            })
        }
    }
    for (const c of n.children || []) walkGaps(c, depth + 1, path, bp)
}

function walkText(n, depth, path, bp) {
    if (!n || depth > 8) return
    if (n.type === "TextNode" || n.type === "RichTextNode") {
        const attrs = n.attributes || {}
        const style = attrs.font || attrs.textStyle || attrs.style || null
        const inlineFont = attrs.fontFamily || attrs.fontName || null
        const size = attrs.fontSize || null
        const preview = (n.attributes?.text || n.name || "").toString().slice(0, 48)
        typeRows.push({
            path,
            bp,
            id: n.id,
            name: n.name || "",
            type: n.type,
            textStyle: attrs.textStyle || attrs.$textStyle || null,
            fontFamily: inlineFont || attrs.fontFamily || null,
            fontSize: size,
            font: typeof style === "string" ? style : null,
            preview,
        })
        const key = String(attrs.textStyle || attrs.$textStyle || inlineFont || size || "unknown")
        styleIds.set(key, (styleIds.get(key) || 0) + 1)
    }
    for (const c of n.children || []) walkText(c, depth + 1, path, bp)
}

for (const p of pages || []) {
    if (!p.path || p.path === "/404") continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 8 }, {})
    for (const bp of ser.children || []) {
        walkGaps(bp, 0, p.path, bp.name)
        walkText(bp, 0, p.path, bp.name)
    }
}

const gapFreq = {}
for (const r of gapRows) {
    const k = r.bp + "|" + r.gap
    gapFreq[k] = (gapFreq[k] || 0) + 1
}
const gapTop = Object.entries(gapFreq).sort((a, b) => b[1] - a[1])

const d1Gaps = gapRows.filter((r) => r.depth === 1)
const d1Freq = {}
for (const r of d1Gaps) {
    const k = r.bp + "|" + r.gap
    d1Freq[k] = (d1Freq[k] || 0) + 1
}

fs.writeFileSync(
    "/Users/noel/Desktop/Framer/.tmp/arbour-gap-type-inventory.json",
    JSON.stringify(
        {
            collectedAt: new Date().toISOString(),
            gapRows,
            typeRows: typeRows.filter((r) => r.bp === "Desktop"), // Desktop sample for type (replicas mirror)
            gapTop,
            d1GapFreq: Object.entries(d1Freq).sort((a, b) => b[1] - a[1]),
            styleFreq: [...styleIds.entries()].sort((a, b) => b[1] - a[1]).slice(0, 40),
        },
        null,
        2,
    ),
)

// Also get project text styles
let textStyles = []
try {
    textStyles = await framer.getTextStyles()
} catch (_) {}

console.log(
    JSON.stringify(
        {
            gaps: gapRows.length,
            d1Gaps: d1Gaps.length,
            d1GapFreq: Object.entries(d1Freq).sort((a, b) => b[1] - a[1]).slice(0, 25),
            gapTop: gapTop.slice(0, 30),
            typeDesktop: typeRows.filter((r) => r.bp === "Desktop").length,
            styleFreq: [...styleIds.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25),
            textStyles: (textStyles || []).map((s) => ({
                id: s.id,
                name: s.name,
                path: s.path,
            })),
            out: ".tmp/arbour-gap-type-inventory.json",
        },
        null,
        2,
    ),
)

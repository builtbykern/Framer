/**
 * Read-only: cross-page layout/style consistency probe for Arbour.
 * Run via: node scripts/framer/exec.mjs -f .tmp/arbour-crosspage-audit.mjs
 */
const fs = require("fs")

const pages = await framer.getNodesWithType("WebPageNode")
const skip = new Set(["/404"])
const out = { collectedAt: new Date().toISOString(), pages: [] }

function padKey(a) {
    if (!a) return null
    return (
        [a.padding, a.paddingTop, a.paddingRight, a.paddingBottom, a.paddingLeft]
            .filter(Boolean)
            .join("|") || null
    )
}

function walkMetrics(node, bp, acc, depth) {
    if (!node || depth > 8) return
    const a = node.attributes || {}
    const name = node.name || node.$componentDisplayName || node.type
    const fill = a.fill || null
    const isSection =
        /section|hero|footer|nav|header|journal|portfolio|territor|bottom|recognition|testimonial|contact|grid|listing|filter|intro|masthead|content|main|wrap|shell|stack|band/i.test(
            name || "",
        ) || depth <= 2
    const interesting =
        isSection ||
        a.padding ||
        a.paddingTop ||
        a.gap ||
        a.maxWidth ||
        node.type === "ComponentInstanceNode" ||
        (typeof fill === "string" &&
            (fill.startsWith("#") || fill.startsWith("rgb") || fill.includes("token")))

    if (interesting && depth <= 5) {
        acc.push({
            bp,
            depth,
            id: node.id,
            name,
            type: node.type,
            component: node.component || null,
            width: a.width ?? null,
            height: a.height ?? null,
            maxWidth: a.maxWidth ?? null,
            padding: padKey(a),
            gap: a.gap ?? null,
            layout: a.layout ?? null,
            stackDirection: a.stackDirection ?? null,
            fill: typeof fill === "string" ? fill.slice(0, 120) : fill,
            fontName: a.fontName ?? null,
            fontSize: a.fontSize ?? null,
            textColor:
                typeof a.textColor === "string" ? a.textColor.slice(0, 80) : (a.textColor ?? null),
        })
    }
    for (const c of node.children || []) walkMetrics(c, bp, acc, depth + 1)
}

function hardColors(node, hits, depth) {
    if (!node || depth > 10) return
    const a = node.attributes || {}
    for (const [k, v] of Object.entries(a)) {
        if (typeof v !== "string") continue
        if (!/(fill|color|border|textColor|stroke)/i.test(k) && !k.includes("Color")) continue
        const hard = /#([0-9a-fA-F]{3,8})\b/.test(v) || /^rgba?\(/.test(v)
        const token = /--token-|var\(/.test(v)
        if (hard && !token) {
            const hex = (v.match(/#[0-9a-fA-F]{3,8}/) || [v.slice(0, 40)])[0]
            hits[hex] = (hits[hex] || 0) + 1
        }
    }
    for (const c of node.children || []) hardColors(c, hits, depth + 1)
}

function instanceNames(node, map, depth) {
    if (!node || depth > 12) return
    if (node.type === "ComponentInstanceNode") {
        const n =
            node.name ||
            node.$componentDisplayName ||
            String(node.component || "").slice(0, 40)
        map[n] = (map[n] || 0) + 1
    }
    for (const c of node.children || []) instanceNames(c, map, depth + 1)
}

for (const p of pages || []) {
    const path = p.path || p.attributes?.path
    if (!path || skip.has(path)) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 10 }, {})
    if (!ser) {
        out.pages.push({ id: p.id, path, error: "serialize null" })
        continue
    }
    const bps = {}
    const hardByBp = {}
    const instancesByBp = {}
    for (const bp of ser.children || []) {
        const metrics = []
        walkMetrics(bp, bp.name, metrics, 0)
        const hard = {}
        hardColors(bp, hard, 0)
        const inst = {}
        instanceNames(bp, inst, 0)
        bps[bp.name] = {
            id: bp.id,
            width: bp.attributes?.width,
            height: bp.attributes?.height,
            fill: bp.attributes?.fill,
            layout: bp.attributes?.layout,
            gap: bp.attributes?.gap,
            padding: padKey(bp.attributes || {}),
            topChildren: (bp.children || []).map((c) => ({
                id: c.id,
                name: c.name || c.$componentDisplayName,
                type: c.type,
                padding: padKey(c.attributes || {}),
                gap: c.attributes?.gap ?? null,
                maxWidth: c.attributes?.maxWidth ?? null,
                width: c.attributes?.width ?? null,
                fill:
                    typeof c.attributes?.fill === "string"
                        ? c.attributes.fill.slice(0, 80)
                        : null,
            })),
            metricsSample: metrics.slice(0, 100),
        }
        hardByBp[bp.name] = hard
        instancesByBp[bp.name] = inst
    }
    out.pages.push({
        id: p.id,
        path,
        name: ser.name,
        title: ser.attributes?.metadata?.title || null,
        description: ser.attributes?.metadata?.description || null,
        bps,
        hardByBp,
        instancesByBp,
    })
}

const preview = await framer.agent.publish({ action: "preview" })
out.preview = {
    changesCount: preview.changesCount,
    changes: (preview.changes || []).map((c) => ({
        name: c.name,
        status: c.status,
        type: c.type,
    })),
    errors: preview.errors || [],
}

fs.writeFileSync(
    "/Users/noel/Desktop/Framer/.tmp/arbour-crosspage-consistency.json",
    JSON.stringify(out, null, 2),
)
console.log(
    JSON.stringify(
        {
            ok: true,
            pageCount: out.pages.length,
            paths: out.pages.map((p) => p.path),
            changesCount: out.preview.changesCount,
            out: ".tmp/arbour-crosspage-consistency.json",
        },
        null,
        2,
    ),
)

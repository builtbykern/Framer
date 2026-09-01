/**
 * Read-only post-consistency template audit probes for Arbour.
 */
const fs = require("fs")
const pages = await framer.getNodesWithType("WebPageNode")
const out = {
    collectedAt: new Date().toISOString(),
    pages: [],
    fxMatrix: {},
    seo: {},
    hardOpaque: {},
    unnamedTops: {},
    maxWidth1440: [],
    padOutliers: [],
    footerNames: {},
    navWidths: {},
}

function padKey(a) {
    if (!a) return null
    return (
        [a.padding, a.paddingTop, a.paddingRight, a.paddingBottom, a.paddingLeft]
            .filter(Boolean)
            .join("|") || null
    )
}

function walkInstances(n, map, depth) {
    if (!n || depth > 14) return
    if (n.type === "ComponentInstanceNode") {
        const name = n.name || n.$componentDisplayName || String(n.component || "").slice(0, 40)
        map[name] = (map[name] || 0) + 1
    }
    for (const c of n.children || []) walkInstances(c, map, depth + 1)
}

function hardOpaque(n, hits, depth) {
    if (!n || depth > 10) return
    const a = n.attributes || {}
    for (const key of ["fill", "textColor", "borderColor"]) {
        const v = a[key]
        if (typeof v !== "string") continue
        if (/var\(--token|rgba?\(|gradient/i.test(v)) continue
        if (/#([0-9a-fA-F]{3,8})\b/.test(v) || /^rgb\(/.test(v)) {
            hits[v.slice(0, 40)] = (hits[v.slice(0, 40)] || 0) + 1
        }
    }
    for (const c of n.children || []) hardOpaque(c, hits, depth + 1)
}

function walkLayout(n, path, acc, depth) {
    if (!n || depth > 8) return
    const a = n.attributes || {}
    const name = n.name || ""
    const pad = padKey(a)
    const mw = a.maxWidth
    if (mw === "1440px" && !/Beat 2|Cinematic Image/i.test(name)) {
        acc.maxWidth1440.push({ path, id: n.id, name })
    }
    if (mw === "1104px") acc.maxWidth1440.push({ path, id: n.id, name, mw })
    if (pad && /112px|144px|124px|80px 48px/.test(pad) && !pad.includes("16px")) {
        acc.padOutliers.push({ path, id: n.id, name, pad })
    }
    for (const c of n.children || []) walkLayout(c, path, acc, depth + 1)
}

const preview = await framer.agent.publish({ action: "preview" })
const info = await framer.getPublishInfo()
const files = await framer.getCodeFiles()
const collections = await framer.getCollections()

// CMS required emptiness sample
const cmsGaps = []
for (const col of collections || []) {
    const fields = col.getFields ? await col.getFields() : col.fields || []
    const items = col.getItems ? await col.getItems() : []
    const required = (fields || []).filter((f) => f.required)
    for (const item of items || []) {
        for (const f of required) {
            const val = item.fieldData?.[f.id]?.value ?? item[f.name]
            const empty =
                val == null ||
                val === "" ||
                (Array.isArray(val) && val.length === 0) ||
                (typeof val === "object" && val && !val.url && !val.src && Object.keys(val).length === 0)
            if (empty) cmsGaps.push({ collection: col.name, item: item.slug || item.id, field: f.name })
        }
    }
}

const GOLD = [
    "Arbour_LoadingScreen",
    "Arbour_SmoothScroll",
    "Atmosphere",
    "Arbour_NoiseEffect",
    "Arbour_ProgressiveBlur",
    "Arbour_ScrollCue",
    "Nav",
    "Footer",
]

for (const p of pages || []) {
    if (!p.path || p.path === "/404") continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 8 }, {})
    const desk = (ser.children || []).find((c) => c.name === "Desktop")
    const inst = {}
    walkInstances(desk, inst, 0)
    const tops = (desk?.children || []).map((c) => c.name || c.$componentDisplayName || null)
    const hard = {}
    hardOpaque(desk, hard, 0)
    const unnamed = (desk?.children || []).filter((c) => !c.name).map((c) => ({ id: c.id, type: c.type }))
    walkLayout(desk, p.path, out, 0)

    const has = (name) =>
        tops.includes(name) ||
        !!inst[name] ||
        (name === "Atmosphere" && tops.includes("Atmosphere")) ||
        (name === "Footer" && (inst.Footer || tops.includes("Footer"))) ||
        (name === "Arbour_NoiseEffect" && !!inst.Arbour_NoiseEffect) ||
        (name === "Arbour_ProgressiveBlur" && !!inst.Arbour_ProgressiveBlur) ||
        (name === "Arbour_ScrollCue" && !!inst.Arbour_ScrollCue)

    out.fxMatrix[p.path] = Object.fromEntries(GOLD.map((g) => [g, has(g) ? "Y" : "-"]))
    out.seo[p.path] = {
        title: ser.attributes?.metadata?.title || null,
        description: ser.attributes?.metadata?.description || null,
    }
    out.hardOpaque[p.path] = hard
    out.unnamedTops[p.path] = unnamed
    out.footerNames[p.path] = {
        Footer: inst.Footer || 0,
        "Footer Container": inst["Footer Container"] || 0,
    }

    // Nav widths on desk
    const navWs = []
    function walkNav(n) {
        if (!n) return
        if (
            n.type === "ComponentInstanceNode" &&
            (n.name === "Nav" || n.component === "ynpqYJGOd" || n.$componentDisplayName === "Nav")
        ) {
            navWs.push({ id: n.id, width: n.attributes?.width, position: n.attributes?.position })
        }
        for (const c of n.children || []) walkNav(c)
    }
    walkNav(desk)
    out.navWidths[p.path] = navWs

    out.pages.push({
        id: p.id,
        path: p.path,
        topCount: tops.length,
        tops,
        deskFill: desk?.attributes?.fill,
        deskWidth: desk?.attributes?.width,
    })
}

// Orphan code files (0 instances)
const codeUsage = {}
for (const f of files || []) codeUsage[f.id] = { name: f.name, count: 0 }
function countCode(n) {
    if (!n) return
    const c = String(n.component || "")
    const m = c.match(/codeFile\/([^:]+)/)
    if (m && codeUsage[m[1]]) codeUsage[m[1]].count++
    for (const ch of n.children || []) countCode(ch)
}
for (const p of pages || []) {
    const ser = await framer.agent.serialize({ id: p.id, depth: 12 }, {})
    countCode(ser)
}
const orphans = Object.entries(codeUsage)
    .filter(([, v]) => v.count === 0)
    .map(([id, v]) => ({ id, name: v.name }))

// Nested UnderlineLink quick scan
let underlineNested = 0
let underlineTotal = 0
for (const p of out.pages) {
    const ser = await framer.agent.serialize({ id: p.id, depth: 12 }, {})
    function walk(n, underLink) {
        if (!n) return
        const isUL =
            n.type === "ComponentInstanceNode" &&
            ((n.name || "").includes("UnderlineLink") || String(n.component || "").includes("Underline"))
        if (isUL) {
            underlineTotal++
            if (underLink) underlineNested++
        }
        const linked = underLink || !!n.attributes?.link
        for (const c of n.children || []) walk(c, linked)
    }
    walk(ser, false)
}

out.preview = {
    changesCount: preview.changesCount,
    changes: (preview.changes || []).map((c) => ({ name: c.name, status: c.status })),
    errors: preview.errors || [],
}
out.publishInfo = info
out.cmsGaps = cmsGaps.slice(0, 30)
out.cmsGapCount = cmsGaps.length
out.orphans = orphans
out.underline = { total: underlineTotal, nestedRisk: underlineNested }
out.codeFileCount = (files || []).length
out.collectionCount = (collections || []).length

fs.writeFileSync(
    "/Users/noel/Desktop/Framer/.tmp/arbour-reaudit-2026-08-08.json",
    JSON.stringify(out, null, 2),
)
console.log(
    JSON.stringify(
        {
            ok: true,
            paths: out.pages.map((p) => p.path),
            changesCount: out.preview.changesCount,
            cmsGapCount: out.cmsGapCount,
            orphans: out.orphans,
            fxMatrix: out.fxMatrix,
            seo: out.seo,
            unnamedTops: Object.fromEntries(
                Object.entries(out.unnamedTops).map(([k, v]) => [k, v.length]),
            ),
            maxWidthLeftover: out.maxWidth1440.length,
            padOutliers: out.padOutliers.length,
            underline: out.underline,
            out: ".tmp/arbour-reaudit-2026-08-08.json",
        },
        null,
        2,
    ),
)

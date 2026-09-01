const fs = require("fs")
const outDir = "/Users/noel/Desktop/Framer/.tmp/halden-audit"
fs.mkdirSync(outDir, { recursive: true })

const info = await framer.getProjectInfo()
const ctx = await framer.agent.getContext({ pagePath: "/" })

function walk(node, fn, path = []) {
    fn(node, path)
    for (const c of node.children || []) walk(c, fn, path.concat(node.id))
}

function flatten(node, acc = []) {
    acc.push(node)
    for (const c of node.children || []) flatten(c, acc)
    return acc
}

const pages = [
    { path: "/", id: "augiA20Il" },
    { path: "/404", id: "nizhx6wAX" },
    { path: "/work/:Work", id: "fpoP3kuA4" },
]

const pageReports = []
for (const p of pages) {
    const page = await framer.agent.getNode({ id: p.id }, { pagePath: p.path })
    const a = page.attributes || {}
    const bps = (page.children || []).map((c) => ({
        id: c.id,
        type: c.type,
        name: c.attributes?.name,
        width: c.attributes?.width,
        height: c.attributes?.height,
        fill: c.attributes?.fill,
        overflow: c.attributes?.overflow,
    }))
    pageReports.push({
        path: p.path,
        id: p.id,
        type: page.type,
        name: a.name,
        title: a["metadata.title"] || a.metadata?.title,
        description: a["metadata.description"] || a.metadata?.description,
        noIndex: a["metadata.noIndex"],
        keys: Object.keys(a).filter((k) => /meta|title|path|layout/i.test(k)),
        breakpoints: bps,
        attrsSample: {
            fill: a.fill,
            width: a.width,
            height: a.height,
            layoutTemplate: a.layoutTemplate,
        },
    })
}

const root = await framer.agent.getNode({ id: "rootNode" })
const rootMeta = {}
for (const [k, v] of Object.entries(root.attributes || {})) {
    if (/meta|title|favicon|description|social/i.test(k)) rootMeta[k] = v
}

const collections = await framer.getCollections()
const cms = []
for (const col of collections) {
    const fields = (col.fields || []).map((f) => ({
        id: f.id,
        name: f.name,
        type: f.type,
        required: f.required,
    }))
    const items = await col.getItems()
    const itemBrief = []
    for (const item of items) {
        const slug = item.slug || item.fieldData?.slug
        const data = item.fieldData || item.data || {}
        const empty = []
        for (const f of fields) {
            const val = data[f.id] ?? data[f.name]
            const isEmpty =
                val == null ||
                val === "" ||
                (Array.isArray(val) && val.length === 0)
            if (isEmpty) empty.push(f.name)
        }
        itemBrief.push({
            id: item.id,
            slug,
            empty,
            keys: Object.keys(data).slice(0, 20),
        })
    }
    cms.push({
        id: col.id,
        name: col.name,
        itemCount: items.length,
        fields,
        items: itemBrief,
    })
}

const colorStyles = await framer.getColorStyles()
const textStyles = await framer.getTextStyles()

const codeFiles = await framer.getCodeFiles()
const codeReport = []
for (const f of codeFiles) {
    const content = f.content || ""
    codeReport.push({
        name: f.name,
        id: f.id,
        bytes: content.length,
        hasRaf: /requestAnimationFrame/.test(content),
        hasFixedRoot: /position:\s*["']fixed["']/.test(content),
        hasStatic: /useIsStaticRenderer|useIsStaticRenderer/.test(content),
        hasWindowGuard: /typeof window/.test(content),
        grain: /grain|feTurbulence|Paper Grain/.test(content),
        exports: (f.exports || []).map((e) => ({
            name: e.name,
            componentId: e.componentId,
            type: e.type,
        })),
    })
}

const unnamed = []
const lorem = []
const links = []
const overflows = []
const grainNodes = []
const paperFills = []
const ghostFrames = []

const ATTRS = [
    "name",
    "fill",
    "href",
    "link.href",
    "overflow",
    "overflowX",
    "width",
    "height",
    "text",
    "component",
    "position",
    "pointerEvents",
    "opacity",
]

for (const p of pages) {
    const tree = await framer.agent.serialize(
        { id: p.id, depth: 12, attributeFilter: ATTRS },
        { pagePath: p.path }
    )
    walk(tree, (n) => {
        const a = n.attributes || {}
        const name = a.name || ""
        if (
            n.type === "FrameNode" &&
            (!name || /^Frame$|^Rectangle|^Layer/i.test(name))
        ) {
            unnamed.push({ page: p.path, id: n.id, name: name || "(empty)", type: n.type })
        }
        const blob = `${name} ${a.text || ""}`
        if (/lorem|ipsum|placeholder text|untitled/i.test(blob)) {
            lorem.push({ page: p.path, id: n.id, name, text: String(a.text || "").slice(0, 80) })
        }
        const href = a["link.href"] || a.href
        if (href) links.push({ page: p.path, id: n.id, name, href, type: n.type })
        if (a.overflowX === "scroll" || a.overflow === "scroll") {
            overflows.push({ page: p.path, id: n.id, name, overflow: a.overflow, overflowX: a.overflowX })
        }
        if (/grain/i.test(name) || String(a.component || "").includes("Qdi6E01")) {
            grainNodes.push({ page: p.path, id: n.id, name, component: a.component })
        }
        if (String(a.fill || "").includes("38f71e00-788a-47bd-a813-10d6b48f262b")) {
            paperFills.push({ page: p.path, id: n.id, name, type: n.type })
        }
        if (n.type === "FrameNode" && (a.opacity === 0 || a.opacity === "0")) {
            ghostFrames.push({ page: p.path, id: n.id, name })
        }
    })
}

const navTree = await framer.agent.serialize({
    id: "Ebz57iEJS",
    depth: 8,
    attributeFilter: ATTRS.concat(["$control__paper", "$control__open", "$control__color"]),
})
const navLinks = []
walk(navTree, (n) => {
    const a = n.attributes || {}
    const href = a["link.href"] || a.href
    if (href) navLinks.push({ id: n.id, name: a.name, href, type: n.type })
})

const token = await framer.agent.getNode({
    id: "38f71e00-788a-47bd-a813-10d6b48f262b",
})

let publish = null
try {
    publish = await framer.getPublishInfo()
} catch (e) {
    publish = { error: String(e) }
}

const report = {
    project: { id: info.id, name: info.name },
    generatedAt: new Date().toISOString(),
    rootMeta,
    pages: pageReports,
    cms,
    colors: (colorStyles || []).map((s) => ({
        id: s.id,
        name: s.name,
        light: s.light || s.colors?.light,
        dark: s.dark || s.colors?.dark,
    })),
    texts: (textStyles || []).map((s) => ({
        id: s.id,
        name: s.name,
        font: s.font,
        fontSize: s.fontSize,
        fontWeight: s.fontWeight,
    })),
    code: codeReport,
    unnamedCount: unnamed.length,
    unnamedSample: unnamed.slice(0, 40),
    lorem,
    links,
    navLinks,
    overflows,
    grainNodes,
    paperFillCount: paperFills.length,
    paperFillsSample: paperFills.slice(0, 30),
    ghostFrames: ghostFrames.slice(0, 20),
    paperToken: token.attributes,
    publish,
    fontsFromContext: true,
}

fs.writeFileSync(`${outDir}/report.json`, JSON.stringify(report, null, 2))
console.log(
    JSON.stringify({
        wrote: `${outDir}/report.json`,
        pages: pageReports.map((p) => p.path),
        cms: cms.map((c) => `${c.name}:${c.itemCount}`),
        unnamed: unnamed.length,
        lorem: lorem.length,
        links: links.length,
        grain: grainNodes,
        paper: token.attributes?.light,
        code: codeReport.map((c) => c.name),
        colors: (colorStyles || []).length,
        texts: (textStyles || []).length,
    })
)

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

let publish = null
try {
    publish = await framer.getPublishInfo()
} catch (e) {
    publish = { error: String(e?.message || e) }
}

const pages = await framer.agent.getNodesOfTypes({ types: ["WebPageNode"] })
const layouts = await framer.agent.getNodesOfTypes({ types: ["LayoutTemplateNode"] })
const redirects = await framer.agent.getNodesOfTypes({ types: ["RedirectNode"] })
const collections = await framer.getCollections()
const codeFiles = await framer.getCodeFiles()

const pageList = (pages?.nodes || pages || []).map((p) => ({
    id: p.id,
    name: p.name,
    path: p.attributes?.path,
    title: p.attributes?.metadata?.title || p.attributes?.["metadata.title"],
    description: p.attributes?.metadata?.description || p.attributes?.["metadata.description"],
    noIndex: p.attributes?.metadata?.noIndex,
    social: p.attributes?.metadata?.socialImage || p.attributes?.["metadata.socialImage"],
}))

const work = collections.find((c) => c.name === "Work")
const fields = await work.getFields()
const items = await work.getItems()

function val(raw) {
    if (raw == null) return null
    if (typeof raw !== "object") return raw
    return raw.value ?? raw
}

const fieldIds = {
    title: "lmTMqy_0B",
    cover: "KF94WDLfr",
    year: "KKPJSa2Nk",
    type: "ZMWV4jFbG",
    gallery: "WTTAaEd5y",
    stills: ["YDvzMtarJ", "e_xsxTDiE", "sFlCMgFPv", "YgsGo3UQv"],
    caps: ["l_tVLXw3B", "SA8C3A7bs", "wxF_wUoGY", "oU0l2SQX9"],
    featured: "LrPrf7_RQ",
    body: "GgZlSrsxB",
    desc: "blc_46opK",
}

const itemAudit = items.map((i) => {
    const fd = i.fieldData || {}
    const gal = fd[fieldIds.gallery]
    const rows = Array.isArray(gal?.value) ? gal.value : Array.isArray(gal) ? gal : []
    const cover = val(fd[fieldIds.cover])
    return {
        slug: i.slug,
        draft: Boolean(i.draft),
        title: val(fd[fieldIds.title]),
        type: val(fd[fieldIds.type]),
        year: val(fd[fieldIds.year]),
        featured: val(fd[fieldIds.featured]),
        hasCover: Boolean(cover && (cover.url || cover.src || typeof cover === "string")),
        coverAlt: cover?.alt || cover?.altText || null,
        galleryLen: rows.length,
        stills: fieldIds.stills.map((id) => Boolean(val(fd[id]))),
        caps: fieldIds.caps.map((id) => val(fd[id]) || ""),
        hasBody: Boolean(val(fd[fieldIds.body]) || val(fd[fieldIds.desc])),
    }
})

const styles = await framer.agent.getNodesOfTypes({
    types: ["TextStylePresetNode", "ColorStyleTokenNode", "LinkStylePresetNode"],
})
const styleNodes = styles?.nodes || styles || []
const textStyles = styleNodes
    .filter((n) => n.type === "TextStylePresetNode" || n.class === "TextStylePresetNode")
    .map((n) => ({ id: n.id, name: n.name, font: n.attributes?.fontName }))
const colors = styleNodes
    .filter((n) => n.type === "ColorStyleTokenNode" || n.class === "ColorStyleTokenNode")
    .map((n) => ({ id: n.id, name: n.name }))
const links = styleNodes
    .filter((n) => n.type === "LinkStylePresetNode" || n.class === "LinkStylePresetNode")
    .map((n) => ({ id: n.id, name: n.name }))

const rootMeta = await framer.agent.getNode({ id: "augiA20Il" }, { pagePath: "/" })
let siteRoot = null
try {
    const roots = await framer.agent.getNodesOfTypes({ types: ["RootNode"] })
    siteRoot = (roots?.nodes || roots || [])[0]
} catch {}

const codeReport = []
for (const f of codeFiles) {
    let content = ""
    try {
        const file = await framer.getCodeFile(f.path || f.name)
        content = await file.getFileContent()
    } catch {
        content = ""
    }
    codeReport.push({
        name: f.name || f.path,
        id: f.id,
        bytes: content.length,
        staticRenderer: content.includes("useIsStaticRenderer"),
        renderTarget: content.includes("RenderTarget"),
        positionFixed: /position:\s*["']fixed["']/.test(content),
        window: content.includes("window."),
        document: content.includes("document."),
    })
}

function unnamed(n, acc = [], page) {
    const name = n.name || n.attributes?.name || ""
    if (!name || /^Frame$|^Text$|^Stack|^Untitled/i.test(name)) {
        acc.push({ id: n.id, name: name || "(empty)", page, type: n.type })
    }
    for (const c of n.children || []) unnamed(c, acc, page)
    return acc
}

const trees = []
for (const p of pageList) {
    if (!p.path) continue
    try {
        const tree = await framer.agent.serialize(
            { id: p.id, depth: 12, attributeFilter: ["name", "component"] },
            { pagePath: p.path }
        )
        trees.push({
            path: p.path,
            unnamed: unnamed(tree, [], p.path).slice(0, 40),
            unnamedCount: unnamed(tree, [], p.path).length,
        })
    } catch (e) {
        trees.push({ path: p.path, error: String(e?.message || e) })
    }
}

const leftovers = await framer.agent.getNodesOfTypes(
    { types: ["ComponentInstanceNode"] },
    { pagePath: "/work/:Work" }
)
const je = (leftovers?.nodes || leftovers || []).filter((n) =>
    String(n.component || n.attributes?.component || n.name || "").match(/jeA2cvO|Series Stills|Still Veil|Error Still/)
)

const homeComps = await framer.agent.getNodesOfTypes(
    { types: ["ComponentInstanceNode"] },
    { pagePath: "/" }
)
const homeJe = (homeComps?.nodes || homeComps || []).map((n) => ({
    id: n.id,
    name: n.name,
    component: n.component || n.attributes?.component,
}))

console.log(
    JSON.stringify(
        {
            project: { name: info.name, id: info.id || info.projectId },
            publish,
            pages: pageList,
            layouts: (layouts?.nodes || layouts || []).map((n) => ({ id: n.id, name: n.name })),
            redirects: (redirects?.nodes || redirects || []).map((n) => ({
                id: n.id,
                from: n.attributes?.from,
                to: n.attributes?.to,
            })),
            fields: fields.map((f) => ({ id: f.id, name: f.name, type: f.type })),
            itemAudit,
            drafts: itemAudit.filter((i) => i.draft).map((i) => i.slug),
            missingCover: itemAudit.filter((i) => !i.hasCover).map((i) => i.slug),
            galleryMismatch: itemAudit.filter(
                (i) => i.galleryLen !== 4 || i.stills.some((s) => !s) || i.caps.some((c) => !c)
            ),
            textStyles,
            colors,
            linkStyles: links,
            rootMeta: rootMeta?.attributes?.metadata || rootMeta?.attributes,
            siteRootAttrs: siteRoot?.attributes,
            codeReport,
            trees,
            workLeftoverStills: je,
            homeComps: homeJe,
        },
        null,
        2
    )
)

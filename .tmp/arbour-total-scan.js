/**
 * Arbour total scan — links, CMS, FX, nested a11y, chrome, publish.
 */
const report = {
    at: new Date().toISOString(),
    project: null,
    publish: null,
    externals: null,
    sitemap: [],
    cms: {},
    nestedLinkRisks: [],
    brokenLinks: [],
    softIssues: [],
    homeFX: [],
    chrome: {},
    code: {},
    counts: {},
}

const info = await framer.getPublishInfo()
report.project = {
    production: info?.production?.url,
    staging: info?.staging?.url,
    optimization: {
        production: info?.production?.optimizationStatus,
        staging: info?.staging?.optimizationStatus,
    },
}

const preview = await framer.agent.publish({ action: "preview" })
report.publish = {
    changesCount: preview.changesCount,
    changes: preview.changes,
    errors: preview.errors,
    status: preview.status,
}

const ctx = await framer.agent.getContext({ pagePath: "/" })
const str = typeof ctx === "string" ? ctx : JSON.stringify(ctx)
const i = str.indexOf("Current Project External Components")
const j = str.indexOf("### Additionally")
report.externals = i >= 0 ? str.slice(i, j > i ? j : i + 400) : null

const pages = []
for (const p of await framer.getNodesWithType("WebPageNode")) {
    const s = await framer.agent.serialize({ id: p.id, depth: 0 }, {})
    pages.push({
        id: p.id,
        path: p.path,
        collectionId: p.collectionId,
        draft: p.draft,
        title: s.attributes?.metadata?.title,
        bp: (s.$breakpoints || []).length,
    })
}
report.sitemap = pages
const pathSet = new Set(pages.map((p) => p.path).filter(Boolean))

function pathExists(href) {
    if (!href || typeof href !== "string") return { ok: false, reason: "empty" }
    if (
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
    ) {
        return { ok: true, kind: "external" }
    }
    if (href.startsWith("#")) return { ok: true, kind: "hash" }
    const clean = href.split("?")[0].split("#")[0]
    if (pathSet.has(clean)) return { ok: true, kind: "exact" }
    for (const p of pathSet) {
        if (!p.includes(":")) continue
        const prefix = p.slice(0, p.indexOf(":"))
        if (clean.startsWith(prefix) && clean.length > prefix.length) {
            return { ok: true, kind: "cms-detail", page: p }
        }
    }
    return { ok: false, reason: "missing-page", clean }
}

const allHrefs = new Set()
const mailto = new Set()
const tel = new Set()
const http = new Set()

async function scanTree(rootId, pagePath) {
    const tree = await framer.agent.serialize({ id: rootId, depth: 14 }, {})
    let ul = 0
    let risks = 0
    let links = 0
    function walk(n, linkedAncestors) {
        if (!n || typeof n !== "object") return
        const name = n.name || n.$componentDisplayName || ""
        const href = n.attributes?.link?.href
        const nextLinked = href
            ? linkedAncestors.concat([{ id: n.id, href }])
            : linkedAncestors
        if (href) {
            links++
            allHrefs.add(href)
            if (href.startsWith("mailto:")) mailto.add(href)
            if (href.startsWith("tel:")) tel.add(href)
            if (href.startsWith("http")) http.add(href)
            const check = pathExists(href)
            if (!check.ok) {
                report.brokenLinks.push({
                    pagePath,
                    id: n.id,
                    name,
                    href,
                    ...check,
                })
            }
        }
        const isUL =
            /UnderlineLink/i.test(name) ||
            String(n.component || "").includes("zCa0pzg")
        if (isUL) {
            ul++
            const d = String(n.attributes?.["$control__decorative"])
            if (d !== "true" && linkedAncestors.length > 0) {
                risks++
                report.nestedLinkRisks.push({
                    pagePath,
                    id: n.id,
                    decorative: d,
                    parents: linkedAncestors,
                })
            }
        }
        for (const c of n.children || []) walk(c, nextLinked)
        for (const b of n.$breakpoints || []) walk(b, linkedAncestors)
        for (const v of n.$variants || []) walk(v, linkedAncestors)
    }
    walk(tree, [])
    return { ul, risks, links }
}

const pageStats = []
for (const p of pages) {
    pageStats.push({ path: p.path, ...(await scanTree(p.id, p.path)) })
}

// Nav + Footer masters
for (const [label, id] of [
    ["Nav", "ynpqYJGOd"],
    ["Footer", "pXUahiblU"],
]) {
    const tree = await framer.agent.serialize({ id, depth: 12 }, {})
    const hrefs = new Set()
    function walk(n) {
        if (!n || typeof n !== "object") return
        const href = n.attributes?.link?.href
        if (href) {
            hrefs.add(href)
            allHrefs.add(href)
            if (href.startsWith("mailto:")) mailto.add(href)
            if (href.startsWith("tel:")) tel.add(href)
            if (href.startsWith("http")) http.add(href)
            const check = pathExists(href)
            if (!check.ok) {
                report.brokenLinks.push({
                    pagePath: `component:${label}`,
                    id: n.id,
                    name: n.name,
                    href,
                    ...check,
                })
            }
        }
        for (const c of n.children || []) walk(c)
        for (const b of n.$breakpoints || []) walk(b)
        for (const v of n.$variants || []) walk(v)
    }
    walk(tree)
    report.chrome[label] = [...hrefs].sort()
}

// CMS
for (const c of await framer.getCollections()) {
    const fields = await c.getFields()
    const items = await c.getItems()
    const gaps = []
    for (const it of items) {
        const g = []
        for (const f of fields) {
            if (!f.required) continue
            const v = it.fieldData?.[f.id]
            const empty =
                v == null ||
                v.value == null ||
                v.value === "" ||
                (Array.isArray(v.value) && !v.value.length)
            if (empty) g.push(f.name)
        }
        if (g.length) gaps.push({ slug: it.slug, g })
    }
    const entry = {
        id: c.id,
        items: items.length,
        fields: fields.map((f) => f.name),
        requiredGaps: gaps,
    }
    if (c.name === "Properties") {
        const nh = fields.find((f) => f.name === "Neighbourhood")
        entry.neighbourhoods = items.map((it) => ({
            slug: it.slug,
            nh: it.fieldData?.[nh.id]?.value ?? null,
        }))
    }
    report.cms[c.name] = entry
}

// Home FX ownership
const home = await framer.agent.serialize({ id: "augiA20Il", depth: 12 }, {})
function walkFx(n) {
    if (!n) return
    const c = String(n.component || "")
    const name = n.name || n.$componentDisplayName || ""
    if (
        /EditorialReveal|ProgressiveBlur|TerritoryRail|Scroll Blur|Stop Scroll|P52cq|eITAB|MxeAzs|gHPemNT|il4DSn9|PaGRz|fOrMtU2/i.test(
            name + c,
        )
    ) {
        report.homeFX.push({ id: n.id, name, component: n.component })
    }
    for (const ch of n.children || []) walkFx(ch)
    for (const b of n.$breakpoints || []) walkFx(b)
}
walkFx(home)

// Key instances
const nhCard = await framer.agent.serialize({ id: "i56eWdACt", depth: 0 }, {})
const propLink = await framer.agent.serialize({ id: "lIX6py1V0", depth: 0 }, {})
const notesUL = await framer.agent.serialize({ id: "TERtNoUYH", depth: 0 }, {})
const grid = await framer.agent.serialize({ id: "D1P7aRrFn", depth: 0 }, {})

report.key = {
    nhCard: nhCard.attributes?.link,
    propertyLink: propLink.attributes?.link,
    notesDecorative: notesUL?.attributes?.["$control__decorative"],
    propertiesFilters:
        grid.attributes?.collectionList?.filters?.length ?? null,
}

// Code gates
const files = await framer.getCodeFiles()
report.code = {
    count: files.length,
    propertyCardStatic: (
        await framer.getCodeFile("Arbour_PropertyCard.tsx")
    ).content.includes("useIsStaticRenderer"),
    articleCardNotesPath: (
        await framer.getCodeFile("Arbour_ArticleCard.tsx")
    ).content.includes("/notes/"),
}

// Soft issues
if (mailto.size > 1) {
    report.softIssues.push({
        type: "mailto-inconsistency",
        values: [...mailto],
    })
}
const placeholderSocial = [...http].filter(
    (u) =>
        u === "https://instagram.com" ||
        u === "https://linkedin.com" ||
        u === "https://x.com" ||
        u === "https://twitter.com",
)
if (placeholderSocial.length) {
    report.softIssues.push({
        type: "placeholder-social",
        values: placeholderSocial,
    })
}
if ([...allHrefs].some((h) => h.includes("/properties-2"))) {
    report.softIssues.push({
        type: "properties-path-suffix",
        note: "Canonical listing path is /properties-2 (Redirects blocked)",
    })
}

const owned = report.homeFX.every(
    (f) =>
        String(f.component || "").startsWith("codeFile/") &&
        !/P52cq|eITAB|MxeAzs/.test(String(f.component || "")),
)
if (!owned) {
    report.softIssues.push({ type: "non-owned-home-fx", fx: report.homeFX })
}

report.counts = {
    pages: pages.length,
    pageStats,
    uniqueHrefs: [...allHrefs].sort(),
    mailto: [...mailto],
    tel: [...tel],
    http: [...http].sort(),
    broken: report.brokenLinks.length,
    nestedRisks: report.nestedLinkRisks.length,
}

console.log(JSON.stringify(report, null, 2))

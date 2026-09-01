/**
 * Arbour template-audit deep pass (read-only) — post /properties publish.
 */
const report = {
  at: new Date().toISOString(),
  project: null,
  publish: null,
  review: null,
  externalsSnippet: null,
  sitemap: [],
  cms: {},
  nestedLinkRisks: [],
  brokenLinks: [],
  softIssues: [],
  homeFX: [],
  chrome: {},
  code: {},
  key: {},
  redirects: null,
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
  deploymentTime: {
    production: info?.production?.deploymentTime,
    staging: info?.staging?.deploymentTime,
  },
}

const preview = await framer.agent.publish({ action: "preview" })
report.publish = {
  changesCount: preview.changesCount,
  changes: preview.changes,
  errors: preview.errors,
  status: preview.status,
  version: preview.version,
}

try {
  report.redirects = (await framer.getRedirects()).map((r) => ({
    from: r.from,
    to: r.to,
  }))
} catch (e) {
  report.redirects = { error: String(e.message || e) }
}

try {
  const ctx = await framer.agent.getContext({ pagePath: "/" })
  const str = typeof ctx === "string" ? ctx : JSON.stringify(ctx)
  const i = str.indexOf("Current Project External Components")
  const j = str.indexOf("### Additionally")
  report.externalsSnippet = i >= 0 ? str.slice(i, j > i ? j : i + 500) : "not-found"
} catch (e) {
  report.externalsSnippet = String(e.message || e)
}

const pages = []
for (const p of await framer.getNodesWithType("WebPageNode")) {
  const s = await framer.agent.serialize({ id: p.id, depth: 0 }, {})
  pages.push({
    id: p.id,
    path: p.path,
    name: p.name || s.name,
    collectionId: p.collectionId ?? s.collectionId ?? null,
    draft: p.draft ?? false,
    title: s.attributes?.metadata?.title ?? null,
    description: (s.attributes?.metadata?.description || "").slice?.(0, 80) ?? null,
    bp: (s.$breakpoints || []).length,
  })
}
report.sitemap = pages
const pathSet = new Set(pages.map((p) => p.path).filter(Boolean))

function pathExists(href) {
  if (!href || typeof href !== "string") return { ok: false, reason: "empty" }
  if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
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
  // Framer CMS pattern /path/:slug as template — href may be literally that
  if (pathSet.has(clean)) return { ok: true, kind: "exact" }
  for (const p of pathSet) {
    if (p.includes("/:")) {
      const [base] = p.split("/:")
      if (clean === base || clean.startsWith(base + "/")) return { ok: true, kind: "cms-pattern", page: p }
    }
  }
  return { ok: false, reason: "missing-page", clean }
}

const mailto = new Set()
const http = new Set()
const allHrefs = new Set()
const pageStats = []

function walkPage(n, pagePath, stats, trail = [], parentLinked = false) {
  if (!n || typeof n !== "object") return
  const name = n.name || n.$componentDisplayName || ""
  const href = n.attributes?.link?.href
  const controlLink = n.attributes?.["$control__link"]
  const decorative = n.attributes?.["$control__decorative"]
  const component = n.component || n.attributes?.component

  if (pagePath === "/" && component && /TerritoryRail|EditorialReveal|ProgressiveBlur|ScrollBlur|StopScroll/i.test(String(component) + name)) {
    report.homeFX.push({ id: n.id, name, component })
  }

  const isLinked = Boolean(href) || parentLinked
  if (href) {
    allHrefs.add(href)
    if (href.startsWith("mailto:")) mailto.add(href)
    if (/^https?:\/\//i.test(href)) http.add(href)
    const ex = pathExists(href)
    if (!ex.ok) report.brokenLinks.push({ pagePath, id: n.id, name, href, ...ex })
    stats.links++
  }
  if (typeof controlLink === "string") {
    if (controlLink.startsWith("mailto:")) mailto.add(controlLink)
    if (/^https?:\/\//i.test(controlLink)) http.add(controlLink)
  }

  // nested UnderlineLink risk: real link control inside already-linked frame
  if (
    /UnderlineLink/i.test(name) &&
    parentLinked &&
    decorative !== true &&
    decorative !== "true"
  ) {
    report.nestedLinkRisks.push({
      pagePath,
      id: n.id,
      name,
      decorative,
      trail: trail.slice(-5),
    })
  }
  if (/UnderlineLink/i.test(name)) stats.ul++

  for (const c of n.children || []) {
    walkPage(c, pagePath, stats, [...trail, name || n.id], isLinked)
  }
  for (const b of n.$breakpoints || []) {
    walkPage(b, pagePath, stats, [...trail, "BP"], isLinked)
  }
}

for (const p of pages) {
  const stats = { path: p.path, ul: 0, risks: 0, links: 0 }
  const tree = await framer.agent.serialize({ id: p.id, depth: 22 }, {})
  walkPage(tree, p.path, stats)
  stats.risks = report.nestedLinkRisks.filter((r) => r.pagePath === p.path).length
  pageStats.push(stats)
}

// Chrome Nav / Footer
async function harvest(id, label) {
  const hrefs = new Set()
  function w(n) {
    if (!n || typeof n !== "object") return
    const href = n.attributes?.link?.href
    if (href) hrefs.add(href)
    const cl = n.attributes?.["$control__link"]
    if (typeof cl === "string") hrefs.add(cl)
    for (const c of n.children || []) w(c)
    for (const b of n.$breakpoints || []) w(b)
    for (const v of n.$variants || n.variants || []) w(v)
  }
  try {
    w(await framer.agent.serialize({ id, depth: 16 }, {}))
  } catch (e) {
    return { label, error: String(e.message || e) }
  }
  return { label, hrefs: [...hrefs].sort() }
}
report.chrome.Nav = await harvest("ynpqYJGOd", "Nav")
report.chrome.Footer = await harvest("pXUahiblU", "Footer")

// CMS required gaps
const cols = await framer.getCollections()
for (const col of cols) {
  const fields = await col.getFields()
  const items = await col.getItems()
  const required = fields.filter((f) => f.required)
  const gaps = []
  for (const item of items) {
    for (const f of required) {
      const v = item.fieldData?.[f.id]
      const empty =
        v == null ||
        v === "" ||
        (typeof v === "object" && v && "value" in v && (v.value == null || v.value === ""))
      if (empty) gaps.push({ item: item.slug || item.id, field: f.name || f.id })
    }
  }
  // Neighbourhood refs on Properties
  const nhField = fields.find((f) => /neighbourhood/i.test(f.name || ""))
  const nhMap = []
  if (nhField) {
    for (const item of items) {
      const v = item.fieldData?.[nhField.id]
      nhMap.push({
        slug: item.slug,
        value: typeof v === "object" ? v?.value ?? v : v,
      })
    }
  }
  report.cms[col.name || col.id] = {
    id: col.id,
    itemCount: items.length,
    requiredCount: required.length,
    requiredGaps: gaps,
    neighbourhoodRefs: nhField ? nhMap : undefined,
  }
}

// Code checks
const codeFiles = await framer.getCodeFiles()
let propertyCardStatic = false
let articleCardNotesPath = false
const codeNames = []
for (const f of codeFiles) {
  codeNames.push({ id: f.id, name: f.name })
  let content = null
  try {
    content = await f.getFileContent()
  } catch {}
  if (typeof content !== "string") continue
  if (/PropertyCard/i.test(f.name || "") && content.includes("useIsStaticRenderer")) {
    propertyCardStatic = true
  }
  if (/ArticleCard/i.test(f.name || "") && content.includes("/notes/")) {
    articleCardNotesPath = true
  }
  if (content.includes("properties-2")) {
    report.softIssues.push({ type: "code-properties-2", file: f.name, id: f.id })
  }
}
report.code = {
  count: codeFiles.length,
  propertyCardStatic,
  articleCardNotesPath,
  names: codeNames,
}

// Key product links
function findFirst(predicate) {
  for (const p of pages) {
    // already walked — use chrome / soft from sets
  }
}
report.key = {
  pathsIncludeProperties: pathSet.has("/properties") && [...pathSet].some((p) => p.startsWith("/properties/:")),
  pathsIncludeProperties2: [...pathSet].some((p) => String(p).includes("properties-2")),
}

// Soft
if (mailto.size > 1) report.softIssues.push({ type: "mailto-inconsistency", values: [...mailto] })
const placeholders = [...http].filter((h) =>
  ["https://instagram.com", "https://linkedin.com", "https://x.com"].includes(h)
)
if (placeholders.length) report.softIssues.push({ type: "placeholder-social", values: placeholders })
if ([...allHrefs].some((h) => String(h).includes("properties-2"))) {
  report.softIssues.push({
    type: "stale-properties-2-href",
    values: [...allHrefs].filter((h) => String(h).includes("properties-2")),
  })
}

// Properties filters
try {
  const propsPage = pages.find((p) => p.path === "/properties")
  if (propsPage) {
    const tree = await framer.agent.serialize({ id: propsPage.id, depth: 12 }, {})
    let filterCount = null
    let listId = null
    function wf(n) {
      if (!n || typeof n !== "object") return
      if (n.id === "D1P7aRrFn" || n.name === "D1P7aRrFn") {
        listId = n.id
        const filters = n.attributes?.filters || n.attributes?.["$control__filters"]
        filterCount = Array.isArray(filters) ? filters.length : filters ?? "present"
      }
      if (n.id === "D1P7aRrFn") {
        filterCount = n.attributes?.filters?.length ?? n.attributes?.collectionFilters?.length ?? filterCount
      }
      for (const c of n.children || []) wf(c)
      for (const b of n.$breakpoints || []) wf(b)
    }
    wf(tree)
    // count filter nodes by walking attributes JSON
    const raw = JSON.stringify(tree)
    const m = raw.match(/D1P7aRrFn/)
    report.key.propertiesList = { mentioned: Boolean(m), filterCount, listId }
  }
} catch (e) {
  report.key.propertiesListError = String(e.message || e)
}

// NH card link
try {
  const nh = pages.find((p) => p.path === "/neighbourhoods")
  if (nh) {
    const tree = await framer.agent.serialize({ id: nh.id, depth: 14 }, {})
    function findCard(n) {
      if (!n || typeof n !== "object") return null
      if (n.id === "i56eWdACt" || /Territory Card/i.test(n.name || "")) {
        return { id: n.id, name: n.name, href: n.attributes?.link?.href, cursor: n.attributes?.cursor }
      }
      for (const c of n.children || []) {
        const f = findCard(c)
        if (f) return f
      }
      for (const b of n.$breakpoints || []) {
        const f = findCard(b)
        if (f) return f
      }
      return null
    }
    report.key.nhCard = findCard(tree)
  }
} catch (e) {
  report.key.nhCardError = String(e.message || e)
}

report.counts = {
  pages: pages.length,
  pageStats,
  uniqueHrefs: [...allHrefs].sort(),
  mailto: [...mailto],
  http: [...http],
  broken: report.brokenLinks.length,
  nestedRisks: report.nestedLinkRisks.length,
  soft: report.softIssues.length,
}

console.log(JSON.stringify(report, null, 2))

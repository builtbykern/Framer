/* Arbour deep template-audit — READ ONLY — 2026-07-29 */
const pages = {
  "/": "augiA20Il",
  "/about": "OdFhPn9yz",
  "/notes": "s8RpZIiJ8",
  "/contact": "c7qpzB7hR",
  "/properties-2": "uBAGmujMa",
  "/neighbourhoods": "dZfxmFpqB",
  "/404": "ojmcAsLyM",
  "/notes/:Journal": "YPPO8pJ92",
  "/properties-2/:Properties": "OhRUQROL4",
}

const publishInfo = await framer.getPublishInfo()
const preview = await framer.agent.publish({ action: "preview" })

const ashcombeHits = []
const hardInk = []
const hardOlive = []
const truncatedInk = []
const freehandArrows = []
const instances = []
const pageMeta = []

function walk(n, pagePath) {
  if (!n) return
  const attrs = n.attributes || {}
  const blob = JSON.stringify(attrs) + " " + (n.name || "")
  if (/ashcombe|ashcombevane|vane\.co\.uk/i.test(blob)) {
    ashcombeHits.push({ pagePath, id: n.id, name: n.name, sample: blob.slice(0, 160) })
  }
  if (typeof attrs.textColor === "string") {
    if (/28\s*,\s*27\s*,\s*22/.test(attrs.textColor)) {
      hardInk.push({ pagePath, id: n.id, name: n.name, textColor: attrs.textColor })
    }
    if (/84\s*,\s*98\s*,\s*45/.test(attrs.textColor)) {
      hardOlive.push({ pagePath, id: n.id, name: n.name, textColor: attrs.textColor })
    }
    if (/token-e2f9a9eb-0000-0000-0000-000000000000/.test(attrs.textColor)) {
      truncatedInk.push({ pagePath, id: n.id, name: n.name, textColor: attrs.textColor })
    }
  }
  if (typeof attrs.text === "string" && /→/.test(attrs.text) && !/RETURN/i.test(attrs.text)) {
    freehandArrows.push({ pagePath, id: n.id, name: n.name, text: attrs.text.slice(0, 80) })
  }
  if (
    n.type === "ComponentInstanceNode" ||
    String(n.type || "").includes("ComponentInstance")
  ) {
    instances.push({
      pagePath,
      id: n.id,
      name: n.name,
      component: attrs.component || attrs.componentIdentifier || null,
    })
  }
  for (const c of n.children || []) walk(c, pagePath)
}

for (const [pagePath, id] of Object.entries(pages)) {
  let meta = null
  try {
    const metaRes = await framer.agent.readProject(
      [{ type: "node", id, attributes: ["metadata", "title", "description", "name"] }],
      { pagePath }
    )
    meta = metaRes?.results?.[0] ?? metaRes
  } catch (e) {
    meta = { error: String(e) }
  }

  let tree
  try {
    tree = await framer.agent.serialize(
      {
        id,
        depth: 12,
        attributeFilter: [
          "text",
          "textColor",
          "fill",
          "name",
          "component",
          "componentIdentifier",
          "href",
          "metadata",
          "opacity",
        ],
      },
      { pagePath }
    )
  } catch (e) {
    pageMeta.push({ pagePath, id, meta, serializeError: String(e) })
    continue
  }
  const root = Array.isArray(tree) ? tree[0] : tree
  walk(root, pagePath)
  pageMeta.push({
    pagePath,
    id,
    meta,
    rootName: root?.name ?? null,
    rootType: root?.type ?? null,
    childCount: root?.children?.length ?? 0,
  })
}

// CMS
const collections = await framer.getCollections()
const cms = []
for (const col of collections) {
  const fields = await col.getFields()
  const items = await col.getItems()
  const byName = Object.fromEntries(fields.map((f) => [f.name, f]))
  const gaps = []
  const samples = []
  for (const item of items) {
    const val = (name) => item.fieldData?.[byName[name]?.id]?.value
    const row = {
      slug: item.slug,
      draft: item.draft,
      title: val("Title") ?? val("Name") ?? null,
      seoTitle: val("SEO Title") ?? null,
      seoDesc: typeof val("SEO Description") === "string" ? val("SEO Description").slice(0, 140) : val("SEO Description"),
      email: val("Email") ?? null,
      hasHero: !!(val("Hero Image") || val("Cover Image") || val("Photo")),
    }
    samples.push(row)
    const missing = []
    for (const need of ["SEO Title", "SEO Description", "Hero Image", "Cover Image", "Photo", "Email", "Name", "Title"]) {
      if (!byName[need]) continue
      const v = val(need)
      const empty =
        v == null ||
        v === "" ||
        (typeof v === "object" && v && !v.url && !v.src && !(Array.isArray(v) && v.length))
      if (empty) missing.push(need)
    }
    if (missing.length) gaps.push({ slug: item.slug, title: row.title, missing })
  }
  // Journal SEO thin-echo heuristic
  const thinSeo = []
  if (byName["SEO Description"] && byName.Title) {
    for (const item of items) {
      const title = item.fieldData?.[byName.Title.id]?.value
      const seo = item.fieldData?.[byName["SEO Description"].id]?.value
      if (typeof title === "string" && typeof seo === "string") {
        const echo =
          seo.startsWith(title) ||
          /—\s*Arbour (field notes|journal|notes)\.?$/i.test(seo.trim())
        if (echo) thinSeo.push({ slug: item.slug, title, seoDesc: seo.slice(0, 120) })
      }
    }
  }
  cms.push({
    id: col.id,
    name: col.name,
    fields: fields.map((f) => f.name),
    itemCount: items.length,
    draftCount: items.filter((i) => i.draft).length,
    gaps,
    thinSeo,
    samples,
  })
}

// Code files live
const codeFiles = await framer.getCodeFiles()
const codeScan = []
for (const cf of codeFiles) {
  const content = cf.content ?? (await cf.getContent?.()) ?? ""
  const text = typeof content === "string" ? content : String(content)
  codeScan.push({
    name: cf.name || cf.path,
    id: cf.id,
    lines: text.split("\n").length,
    useIsStaticRenderer: /useIsStaticRenderer/.test(text),
    useIsOnFramerCanvas: /useIsOnFramerCanvas/.test(text),
    useReducedMotion: /useReducedMotion|prefers-reduced-motion/.test(text),
    importsMotion: /from ["']motion\/react["']|from ["']framer-motion["']/.test(text),
    hasDefaultExport: /export\s+default/.test(text),
    hasPropertyControls: /addPropertyControls/.test(text),
    hasLayoutAnnotations: /@framerSupportedLayout/.test(text),
    usesFixed: /position:\s*["']fixed["']/.test(text),
    infiniteRepeat: /repeat:\s*Infinity|Infinity/.test(text) && /animate|transition/.test(text),
    aria: /aria-label|ariaLabel|role=/.test(text),
  })
}

const byName = {}
for (const i of instances) {
  const k = i.name || i.component || "unknown"
  byName[k] = (byName[k] || 0) + 1
}
const externalLike = instances.filter((i) =>
  /scroll blur|stop scroll|film grain|noiser/i.test(`${i.name || ""} ${i.component || ""}`)
)

const out = {
  collectedAt: new Date().toISOString(),
  projectHint: "Arbour",
  publishInfo,
  preview: {
    changesCount: preview?.changesCount ?? null,
    errors: preview?.errors ?? null,
    warnings: preview?.warnings ?? null,
    changes: preview?.changes ?? null,
    status: preview?.status ?? null,
    version: preview?.version ?? null,
  },
  pageMeta,
  counts: {
    ashcombe: ashcombeHits.length,
    hardInk: hardInk.length,
    hardOlive: hardOlive.length,
    truncatedInk: truncatedInk.length,
    freehandArrows: freehandArrows.length,
    instances: instances.length,
  },
  ashcombeHits: ashcombeHits.slice(0, 20),
  hardInk: hardInk.slice(0, 30),
  hardOlive: hardOlive.slice(0, 20),
  truncatedInk: truncatedInk.slice(0, 10),
  freehandArrows: freehandArrows.slice(0, 15),
  instanceNames: byName,
  externalLike,
  cms,
  codeScan,
}
console.log(JSON.stringify(out))

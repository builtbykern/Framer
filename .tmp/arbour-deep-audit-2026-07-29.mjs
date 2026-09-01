/**
 * Arbour deep template-audit scan — READ ONLY
 */
const pages = [
  "/", "/properties-2", "/neighbourhoods", "/notes", "/about", "/contact", "/404",
  "/properties-2/:Properties", "/notes/:Journal"
]

const INK_RE = /28\s*,\s*27\s*,\s*22/
const OLIVE_RE = /84\s*,\s*98\s*,\s*45/
const ASH_RE = /ashcombe|ashcombevane/i

function countHardRgb(node, re, key = "textColor") {
  let n = 0
  const walk = (x) => {
    if (!x || typeof x !== "object") return
    if (typeof x[key] === "string" && re.test(x[key])) n++
    // also backgrounds / fills
    for (const k of Object.keys(x)) {
      if (k === "children" || k === "nodes") continue
      if (typeof x[k] === "string" && re.test(x[k]) && /color|fill|background|border/i.test(k)) n++
      else if (typeof x[k] === "object") walk(x[k])
    }
    const kids = x.children || x.nodes || []
    if (Array.isArray(kids)) kids.forEach(walk)
  }
  walk(node)
  return n
}

function textBlob(node) {
  const parts = []
  const walk = (x) => {
    if (!x || typeof x !== "object") return
    if (typeof x.text === "string") parts.push(x.text)
    if (typeof x.content === "string") parts.push(x.content)
    const kids = x.children || x.nodes || []
    if (Array.isArray(kids)) kids.forEach(walk)
  }
  walk(node)
  return parts.join("\n")
}

const publishPreview = await framer.agent.publish({ type: "preview" }).catch((e) => ({ error: String(e) }))
const publishInfo = await framer.getPublishInfo?.() ?? await framer.agent?.getPublishInfo?.() ?? null

const pageReports = []
for (const path of pages) {
  try {
    const ctx = await framer.agent.getContext({ pagePath: path })
    const meta = ctx?.metadata || ctx?.page?.metadata || null
    const tree = ctx?.root || ctx?.page || ctx
    const blob = textBlob(tree)
    pageReports.push({
      path,
      title: meta?.title ?? ctx?.title ?? null,
      description: meta?.description ?? null,
      hardInk: countHardRgb(tree, INK_RE),
      hardOlive: countHardRgb(tree, OLIVE_RE),
      ashHits: (blob.match(ASH_RE) || []).length,
      ashSample: blob.match(ASH_RE)?.[0] ?? null,
      nodeHint: typeof tree === "object" ? Object.keys(tree || {}).slice(0, 12) : typeof tree,
    })
  } catch (e) {
    pageReports.push({ path, error: String(e) })
  }
}

// CMS deep
const collections = await framer.getCollections()
const cms = []
for (const col of collections) {
  const fields = await col.getFields()
  const items = await col.getItems()
  const fieldNames = fields.map((f) => f.name)
  const gaps = []
  for (const item of items) {
    const row = { id: item.id, slug: item.slug }
    const fieldMap = {}
    for (const f of fields) {
      const v = item.fieldData?.[f.id] ?? item.fieldData?.[f.name]
      fieldMap[f.name] = v
    }
    const missing = []
    for (const need of ["SEO Title", "SEO Description", "Hero Image", "Cover Image", "Photo", "Email", "Name", "Title"]) {
      if (!fieldNames.includes(need)) continue
      const v = fieldMap[need]
      const empty =
        v == null ||
        v === "" ||
        (typeof v === "object" && v && !v.url && !v.src && !(Array.isArray(v) && v.length))
      if (empty) missing.push(need)
    }
    if (missing.length) gaps.push({ slug: item.slug, missing, title: fieldMap.Title || fieldMap.Name })
    row.seoTitle = fieldMap["SEO Title"] ?? null
    row.seoDesc = typeof fieldMap["SEO Description"] === "string" ? fieldMap["SEO Description"].slice(0, 120) : fieldMap["SEO Description"]
    row.hasImage = !!(fieldMap["Hero Image"] || fieldMap["Cover Image"] || fieldMap.Photo)
    row.email = fieldMap.Email ?? null
    cms.push?.() // noop keep lint quiet
    // stash per collection below
  }
  cms.push({
    id: col.id,
    name: col.name,
    fieldNames,
    itemCount: items.length,
    gaps,
    samples: items.slice(0, 3).map((item) => {
      const fieldMap = {}
      for (const f of fields) fieldMap[f.name] = item.fieldData?.[f.id] ?? item.fieldData?.[f.name]
      return {
        slug: item.slug,
        title: fieldMap.Title || fieldMap.Name,
        seoTitle: fieldMap["SEO Title"] ?? null,
        seoDesc: typeof fieldMap["SEO Description"] === "string" ? fieldMap["SEO Description"].slice(0, 100) : null,
        email: fieldMap.Email ?? null,
      }
    }),
  })
}

// Code file pulls for motionStaticRisk + reduced motion
const riskFiles = [
  "Arbour_InertiaFrame.tsx",
  "Arbour_ScrollCue.tsx",
  "Arbour_EditorialReveal.tsx",
  "Arbour_UnderlineLink.tsx",
  "Arbour_TerritoryRail.tsx",
  "Arbour_ProgressiveBlur.tsx",
  "Arbour_PrimaryButton.tsx",
  "Arbour_FormButton.tsx",
  "Arbour_SectionHeader.tsx",
  "Arbour_ArticleCard.tsx",
  "Arbour_StatsBand.tsx",
  "Arbour_MenuIcon.tsx",
  "Arbour_NoiseEffect.tsx",
  "Arbour_LoadingScreen.tsx",
  "Arbour_PropertyCard.tsx",
]
const codeFiles = await framer.getCodeFiles()
const codeScan = []
for (const name of riskFiles) {
  const cf = codeFiles.find((f) => f.name === name || f.path === name)
  if (!cf) {
    codeScan.push({ name, missing: true })
    continue
  }
  const content = await cf.getContent()
  codeScan.push({
    name,
    id: cf.id,
    lines: content.split("\n").length,
    useIsStaticRenderer: /useIsStaticRenderer/.test(content),
    useReducedMotion: /useReducedMotion|prefers-reduced-motion/.test(content),
    useRenderTarget: /RenderTarget/.test(content),
    importsMotion: /from ["']motion\/react["']|from ["']framer-motion["']/.test(content),
    hasDefaultExport: /export\s+default/.test(content),
    hasPropertyControls: /addPropertyControls/.test(content),
    hasLayoutAnnotations: /@framerSupportedLayout/.test(content),
    usesFixedRoot: /position:\s*["']fixed["']/.test(content),
    ariaLabel: /aria-label|ariaLabel/.test(content),
  })
}

const result = {
  collectedAt: new Date().toISOString(),
  publishPreview: {
    changesCount: publishPreview?.changesCount ?? publishPreview?.changeCount ?? null,
    errors: publishPreview?.errors ?? null,
    error: publishPreview?.error ?? null,
    keys: publishPreview && typeof publishPreview === "object" ? Object.keys(publishPreview) : null,
    rawSnippet: JSON.stringify(publishPreview)?.slice(0, 800),
  },
  publishInfo,
  pageReports,
  cms,
  codeScan,
}
console.log(JSON.stringify(result, null, 2))

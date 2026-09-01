const collections = await framer.getCollections()

function empty(fd) {
  if (fd == null) return true
  const val = typeof fd === "object" && fd !== null && "value" in fd ? fd.value : fd
  if (val == null) return true
  if (typeof val === "string") return val.trim() === ""
  if (typeof val === "boolean" || typeof val === "number") return false
  if (Array.isArray(val)) return val.length === 0
  if (typeof val === "object") {
    if ("url" in val) return !val.url
    if ("src" in val) return !val.src
    // collectionReference often { id, name } or similar
    if ("id" in val && val.id) return false
    // enum case
    if ("name" in val || "value" in val) {
      const inner = val.value ?? val.name
      if (inner == null || inner === "") return true
      return false
    }
    // formattedText might be object with content
    if ("content" in val) return !val.content || String(val.content).trim() === ""
    // non-empty object — treat as present
    return Object.keys(val).length === 0
  }
  return false
}

function rawValue(fd) {
  if (fd == null) return null
  return typeof fd === "object" && fd !== null && "value" in fd ? fd.value : fd
}

const report = []

for (const c of collections || []) {
  const fields = await c.getFields()
  const items = await c.getItems()
  const fieldMeta = fields
    .filter((f) => f.type !== "divider")
    .map((f) => ({ id: f.id, name: f.name, type: f.type }))

  const byName = Object.fromEntries(fieldMeta.map((f) => [f.name, f]))

  // Primary image candidates per collection
  const primaryImageNames = ["Hero Image", "Cover Image", "Photo", "Image", "Thumbnail"]
  const seoTitleNames = ["SEO Title", "Meta Title", "Seo Title"]
  const seoDescNames = ["SEO Description", "Meta Description", "Seo Description"]

  const primaryImageFields = fieldMeta.filter((f) => primaryImageNames.includes(f.name) || f.type === "image" && primaryImageNames.some((n) => f.name.toLowerCase() === n.toLowerCase()))
  // Prefer named primaries; if none, first image field
  let imgFields = fieldMeta.filter((f) => primaryImageNames.includes(f.name))
  if (imgFields.length === 0) imgFields = fieldMeta.filter((f) => f.type === "image").slice(0, 1)

  const seoTitle = fieldMeta.filter((f) => seoTitleNames.includes(f.name) || /^seo\s*title$/i.test(f.name))
  const seoDesc = fieldMeta.filter((f) => seoDescNames.includes(f.name) || /^seo\s*description$/i.test(f.name))

  // Per-field emptiness counts for ALL fields
  const fieldGaps = {}
  for (const f of fieldMeta) {
    fieldGaps[f.name] = { type: f.type, emptyCount: 0, emptySlugs: [] }
  }

  const itemRows = []
  for (const item of items) {
    const row = { id: item.id, slug: item.slug || null, draft: !!item.draft, emptyFields: [] }
    for (const f of fieldMeta) {
      const isEmpty = empty(item.fieldData?.[f.id])
      if (isEmpty) {
        fieldGaps[f.name].emptyCount++
        if (fieldGaps[f.name].emptySlugs.length < 15) fieldGaps[f.name].emptySlugs.push(item.slug || item.id)
        row.emptyFields.push(f.name)
      }
    }
    // title hint
    for (const n of ["Title", "Name"]) {
      if (byName[n]) {
        const v = rawValue(item.fieldData?.[byName[n].id])
        if (typeof v === "string") row.title = v.slice(0, 100)
      }
    }
    itemRows.push(row)
  }

  // Focused gaps
  const focused = {
    emptySlug: items.filter((i) => !i.slug || String(i.slug).trim() === "").map((i) => i.id),
    emptyPrimaryImage: {},
    emptySeoTitle: [],
    emptySeoDescription: [],
  }
  for (const f of imgFields) {
    focused.emptyPrimaryImage[f.name] = items
      .filter((i) => empty(i.fieldData?.[f.id]))
      .map((i) => ({ slug: i.slug, id: i.id }))
  }
  for (const f of seoTitle) {
    focused.emptySeoTitle = items
      .filter((i) => empty(i.fieldData?.[f.id]))
      .map((i) => ({ slug: i.slug, id: i.id }))
  }
  for (const f of seoDesc) {
    focused.emptySeoDescription = items
      .filter((i) => empty(i.fieldData?.[f.id]))
      .map((i) => ({ slug: i.slug, id: i.id }))
  }

  // Secondary gallery image gaps (Properties)
  const galleryImgs = fieldMeta.filter((f) => /^Gallery Image/i.test(f.name) || f.name === "Gallery" || f.name === "Map")
  const secondary = {}
  for (const f of galleryImgs) {
    secondary[f.name] = {
      emptyCount: fieldGaps[f.name].emptyCount,
      emptySlugs: fieldGaps[f.name].emptySlugs,
    }
  }

  report.push({
    id: c.id,
    name: c.name,
    itemCount: items.length,
    fields: fieldMeta,
    focused,
    secondaryImageGaps: secondary,
    fieldGaps: Object.fromEntries(
      Object.entries(fieldGaps).map(([k, v]) => [k, { type: v.type, emptyCount: v.emptyCount, emptySlugs: v.emptySlugs }])
    ),
    itemsWithAnyCriticalGap: itemRows
      .filter((r) => {
        const crit = new Set([
          ...imgFields.map((f) => f.name),
          ...seoTitle.map((f) => f.name),
          ...seoDesc.map((f) => f.name),
        ])
        return !r.slug || r.emptyFields.some((n) => crit.has(n))
      })
      .map((r) => ({ slug: r.slug, title: r.title, emptyFields: r.emptyFields.filter((n) => imgFields.some((f) => f.name === n) || seoTitle.some((f) => f.name === n) || seoDesc.some((f) => f.name === n) || n === "Neighbourhood") })),
  })
}

console.log(JSON.stringify({ collectedAt: new Date().toISOString(), collections: report }, null, 2))

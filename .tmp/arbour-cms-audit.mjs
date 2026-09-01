/**
 * Read-only CMS deep audit for Arbour.
 * Writes JSON to stdout via framer exec payload.
 */
const collections = await framer.getCollections()

function isEmptyValue(v) {
  if (v == null) return true
  if (typeof v === "string") return v.trim() === ""
  if (Array.isArray(v)) return v.length === 0
  if (typeof v === "object") {
    if ("url" in v && (v.url == null || v.url === "")) return true
    if ("src" in v && (v.src == null || v.src === "")) return true
    // image-like
    if ("type" in v && (v.type === "image" || v.type === "file") && !v.value && !v.url) {
      const val = v.value
      if (val == null) return true
      if (typeof val === "string" && val.trim() === "") return true
      if (typeof val === "object" && (!val.url || val.url === "")) return true
    }
  }
  return false
}

function fieldValueEmpty(fieldEntry) {
  if (fieldEntry == null) return true
  if (typeof fieldEntry !== "object") return String(fieldEntry).trim() === ""
  const val = "value" in fieldEntry ? fieldEntry.value : fieldEntry
  if (val == null) return true
  if (typeof val === "string") return val.trim() === ""
  if (Array.isArray(val)) return val.length === 0
  if (typeof val === "object") {
    if ("url" in val) return !val.url
    if ("src" in val) return !val.src
  }
  return false
}

function classifySeoFields(fields) {
  const seo = { title: [], description: [], image: [] }
  for (const f of fields) {
    const n = (f.name || "").toLowerCase()
    const t = (f.type || "").toLowerCase()
    if (t === "divider" || t === "unsupported") continue
    // SEO title
    if (
      n.includes("seo") && (n.includes("title") || n.includes("meta title") || n === "seo title") ||
      n === "meta title" || n === "og title" || n === "page title"
    ) {
      seo.title.push(f)
    } else if (
      n.includes("seo") && (n.includes("desc") || n.includes("description")) ||
      n === "meta description" || n === "og description" || n === "seo description"
    ) {
      seo.description.push(f)
    } else if (
      (n.includes("seo") || n.includes("og") || n.includes("social")) &&
      (n.includes("image") || n.includes("img") || t === "image")
    ) {
      seo.image.push(f)
    }
  }
  return seo
}

function findImageFields(fields) {
  return fields.filter((f) => {
    const t = (f.type || "").toLowerCase()
    const n = (f.name || "").toLowerCase()
    if (t === "image") return true
    if (t === "divider" || t === "unsupported") return false
    // common primary image names (not seo)
    if ((n === "image" || n === "cover" || n === "thumbnail" || n === "photo" || n === "hero" || n === "featured image" || n === "main image") && t !== "string") {
      return true
    }
    return false
  })
}

function findSlugRelatedFields(fields) {
  // slug is usually on the item itself; also check string fields named slug
  return fields.filter((f) => (f.name || "").toLowerCase() === "slug")
}

const collectionReports = []

for (const c of collections || []) {
  const fieldsRaw = typeof c.getFields === "function" ? await c.getFields() : []
  const fields = (fieldsRaw || []).map((f) => ({
    id: f.id,
    name: f.name,
    type: f.type,
    required: f.required ?? null,
  }))

  const itemsRaw = typeof c.getItems === "function" ? await c.getItems() : []
  const items = itemsRaw || []

  const seoFields = classifySeoFields(fields)
  const imageFields = findImageFields(fields).filter((f) => {
    const n = (f.name || "").toLowerCase()
    // exclude SEO image from "content image" if already in seo.image
    return !seoFields.image.some((s) => s.id === f.id)
  })
  // Prefer primary content images; if none, still report image-type fields including seo
  const gapImageFields = imageFields.length > 0 ? imageFields : findImageFields(fields)

  const emptySlug = []
  const emptyImage = []
  const emptySeoTitle = []
  const emptySeoDescription = []
  const emptySeoImage = []
  const drafts = []
  const itemSummaries = []

  for (const item of items) {
    const slug = item.slug
    const slugEmpty = slug == null || String(slug).trim() === ""
    if (slugEmpty) emptySlug.push({ id: item.id, slug: slug ?? null })

    if (item.draft) drafts.push({ id: item.id, slug: slug ?? null })

    // title-ish for reporting
    let titleHint = null
    for (const f of fields) {
      const n = (f.name || "").toLowerCase()
      if (n === "title" || n === "name" || n === "headline") {
        const fd = item.fieldData?.[f.id]
        const v = fd && "value" in fd ? fd.value : fd
        if (typeof v === "string" && v.trim()) {
          titleHint = v.trim().slice(0, 80)
          break
        }
      }
    }

    const gapsForItem = { slug: slugEmpty, image: false, seoTitle: false, seoDescription: false, seoImage: false }

    if (gapImageFields.length > 0) {
      const allEmpty = gapImageFields.every((f) => fieldValueEmpty(item.fieldData?.[f.id]))
      if (allEmpty) {
        gapsForItem.image = true
        emptyImage.push({ id: item.id, slug: slug ?? null, title: titleHint })
      }
    }

    if (seoFields.title.length > 0) {
      const allEmpty = seoFields.title.every((f) => fieldValueEmpty(item.fieldData?.[f.id]))
      if (allEmpty) {
        gapsForItem.seoTitle = true
        emptySeoTitle.push({ id: item.id, slug: slug ?? null, title: titleHint })
      }
    }

    if (seoFields.description.length > 0) {
      const allEmpty = seoFields.description.every((f) => fieldValueEmpty(item.fieldData?.[f.id]))
      if (allEmpty) {
        gapsForItem.seoDescription = true
        emptySeoDescription.push({ id: item.id, slug: slug ?? null, title: titleHint })
      }
    }

    if (seoFields.image.length > 0) {
      const allEmpty = seoFields.image.every((f) => fieldValueEmpty(item.fieldData?.[f.id]))
      if (allEmpty) {
        gapsForItem.seoImage = true
        emptySeoImage.push({ id: item.id, slug: slug ?? null, title: titleHint })
      }
    }

    itemSummaries.push({
      id: item.id,
      slug: slug ?? null,
      draft: !!item.draft,
      title: titleHint,
      gaps: gapsForItem,
    })
  }

  collectionReports.push({
    id: c.id,
    name: c.name,
    managedBy: c.managedBy ?? null,
    slugFieldName: c.slugFieldName ?? null,
    fields: fields.filter((f) => f.type !== "divider"),
    allFieldNames: fields.map((f) => `${f.name}:${f.type}`),
    itemCount: items.length,
    draftCount: drafts.length,
    gapFieldsPresent: {
      slug: true, // always on CollectionItem
      image: gapImageFields.map((f) => f.name),
      seoTitle: seoFields.title.map((f) => f.name),
      seoDescription: seoFields.description.map((f) => f.name),
      seoImage: seoFields.image.map((f) => f.name),
    },
    gaps: {
      emptySlug: { count: emptySlug.length, items: emptySlug.slice(0, 25) },
      emptyImage: { count: emptyImage.length, items: emptyImage.slice(0, 25) },
      emptySeoTitle: { count: emptySeoTitle.length, items: emptySeoTitle.slice(0, 25) },
      emptySeoDescription: { count: emptySeoDescription.length, items: emptySeoDescription.slice(0, 25) },
      emptySeoImage: { count: emptySeoImage.length, items: emptySeoImage.slice(0, 25) },
    },
    items: itemSummaries,
  })
}

// Pages — detect CMS detail vs listing
let pages = []
try {
  const pageList = await framer.getPages()
  pages = await Promise.all(
    (pageList || []).map(async (p) => {
      const info = {
        id: p.id,
        name: p.name,
        path: p.path,
        collectionId: p.collectionId ?? p.collection?.id ?? null,
        webPageType: p.webPageType ?? p.type ?? null,
        isCollectionPage: !!(p.collectionId || p.collection),
      }
      // try extra props that may indicate detail pages
      for (const key of ["collection", "cmsCollectionId", "dataSource", "isDetailPage", "pageType", "routeType"]) {
        try {
          if (p[key] !== undefined) info[key] = typeof p[key] === "object" ? (p[key]?.id || p[key]?.name || String(p[key])) : p[key]
        } catch (_) {}
      }
      return info
    })
  )
} catch (e) {
  pages = { error: String(e && e.message ? e.message : e) }
}

// Also try getNodes / project pages from context if available
let contextPages = null
try {
  if (typeof framer.getContext === "function") {
    // skip — expensive / discouraged
  }
} catch (_) {}

// Map collectionId -> pages that reference it
const collectionPageMap = {}
if (Array.isArray(pages)) {
  for (const p of pages) {
    const cid = p.collectionId || p.cmsCollectionId || null
    if (cid) {
      if (!collectionPageMap[cid]) collectionPageMap[cid] = []
      collectionPageMap[cid].push({ id: p.id, name: p.name, path: p.path, webPageType: p.webPageType })
    }
    // path heuristics: /foo/:slug or contains :slug
    const path = p.path || ""
    if (path.includes(":") || /\/[a-z0-9-]+\/:/.test(path) || path.endsWith("/:slug")) {
      p.likelyDetail = true
    }
  }
}

const out = {
  collectedAt: new Date().toISOString(),
  projectId: "CmRyHJKPrPE6BZhC6d4S",
  collectionCount: collectionReports.length,
  collections: collectionReports,
  pages,
  collectionPageMap,
}

console.log(JSON.stringify(out))

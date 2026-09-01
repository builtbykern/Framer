const SEO = {
  "cheyne-walk-riverside-residence":
    "Four-bedroom riverside residence on Cheyne Walk, Chelsea — restored brick façade, raised-ground receptions, and Thames views across 2,840 sq ft.",
  "frognal-georgian-villa":
    "Grade II Georgian villa on Frognal, Hampstead — six bedrooms, Heath-backed gardens, and period reception rooms across 5,800 sq ft.",
  "bibury-stone-manor":
    "Honey-stone Cotswolds manor near Bibury — five bedrooms, seventeenth-century character, and private approach across 4,200 sq ft.",
  "royal-avenue-lateral-apartment":
    "Lateral first-floor apartment on Royal Avenue, Chelsea — two bedrooms, private balcony over plane trees, and open modern plan across 1,680 sq ft.",
  "ladbroke-grove-garden-house":
    "Five-bedroom garden house on Ladbroke Grove, Notting Hill — period front rooms, glass-walled rear, and courtyard living across 3,420 sq ft.",
  "colville-mews-house":
    "Three-bedroom mews house off Colville Terrace, Notting Hill — cobbled approach, teal door, and bright open-plan living across 1,420 sq ft.",
}

const cols = await framer.getCollections()
const prop = cols.find((c) => c.name === "Properties")
const fields = await prop.getFields()
const seoField = fields.find((f) => f.name === "SEO Description")
const items = await prop.getItems()
const updated = []
for (const item of items) {
  const next = SEO[item.slug]
  if (!next) {
    updated.push({ slug: item.slug, skipped: true })
    continue
  }
  await item.setAttributes({
    fieldData: {
      [seoField.id]: { type: "string", value: next },
    },
  })
  updated.push({ slug: item.slug, ok: true })
}
const verify = await prop.getItems()
const after = verify.map((item) => ({
  slug: item.slug,
  seo: item.fieldData?.[seoField.id]?.value,
  stub: String(item.fieldData?.[seoField.id]?.value || "").includes(
    "Arbour instruction"
  ),
}))
console.log(JSON.stringify({ updated, after }, null, 2))

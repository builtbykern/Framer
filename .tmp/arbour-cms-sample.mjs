const collections = await framer.getCollections()
const out = []
for (const c of collections) {
  const fields = await c.getFields()
  const items = await c.getItems()
  const usable = fields.filter((f) => f.type !== "divider")
  const samples = items.slice(0, 3).map((item) => {
    const row = { id: item.id, slug: item.slug, draft: item.draft }
    for (const f of usable) {
      const fd = item.fieldData?.[f.id]
      let v = fd && typeof fd === "object" && "value" in fd ? fd.value : fd
      if (v && typeof v === "object") {
        if (v.url) v = { type: "asset", url: String(v.url).slice(0, 60) }
        else if (Array.isArray(v)) v = { type: "array", length: v.length }
        else if (f.type === "collectionReference") v = { ref: v.id || v, keys: Object.keys(v) }
        else if (f.type === "formattedText") {
          const s = typeof v === "string" ? v : JSON.stringify(v)
          v = { type: "formattedText", len: s.length, preview: s.slice(0, 80) }
        } else if (f.type === "enum") v = v
        else v = { keys: Object.keys(v), preview: JSON.stringify(v).slice(0, 100) }
      }
      if (typeof v === "string" && v.length > 120) v = v.slice(0, 120) + "…"
      row[f.name] = v
    }
    return row
  })
  // integrity: Properties neighbourhood refs
  let refIssues = []
  if (c.name === "Properties") {
    const nh = collections.find((x) => x.name === "Neighbourhoods")
    const nhItems = nh ? await nh.getItems() : []
    const nhIds = new Set(nhItems.map((i) => i.id))
    const refField = usable.find((f) => f.name === "Neighbourhood")
    for (const item of items) {
      const fd = item.fieldData?.[refField.id]
      const v = fd && "value" in fd ? fd.value : fd
      const rid = v && (v.id || v)
      if (!rid) refIssues.push({ slug: item.slug, issue: "missing neighbourhood ref" })
      else if (!nhIds.has(rid) && !nhIds.has(String(rid))) {
        // also try nodeId
        const ok = nhItems.some((n) => n.id === rid || n.nodeId === rid)
        if (!ok) refIssues.push({ slug: item.slug, issue: "orphan neighbourhood ref", ref: rid })
      }
    }
  }
  out.push({ name: c.name, id: c.id, itemCount: items.length, samples, refIssues })
}
console.log(JSON.stringify(out, null, 2))

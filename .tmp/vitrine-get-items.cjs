const col = await framer.getCollection("t2sbY17Aq")
const items = await col.getItems()
const fields = await col.getFields?.()

console.log(
    JSON.stringify(
        {
            fieldIds: fields
                ? (Array.isArray(fields) ? fields : fields.fields || []).map((f) => ({
                      id: f.id,
                      name: f.name,
                      type: f.type,
                  }))
                : Object.keys(items[0]?.fieldData || {}),
            rows: items.map((it) => {
                const fd = it.fieldData || {}
                const out = { id: it.id, slug: it.slug, draft: it.draft }
                for (const [k, v] of Object.entries(fd)) {
                    const val = v && typeof v === "object" && "value" in v ? v.value : v
                    if (val && typeof val === "object" && val.src) {
                        out[k] = { src: val.src, alt: val.alt }
                    } else {
                        out[k] = val
                    }
                }
                return out
            }),
        },
        null,
        2
    )
)

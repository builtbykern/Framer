const col = await framer.getCollection("t2sbY17Aq")
const items = await col.getItems()
const bySlug = {
    "glass-hours": "dish-two",
    "unmade-light": "gauge-ring",
    "the-fitting": "wire-study",
    "night-atlas": "cup-lip",
    "salt-light": "linen-band",
    "inland-signal": "square-tray",
    "service-stairs": "bench-hook",
    "late-pool": "pin-spare",
}

const results = []
for (const it of items) {
    const next = bySlug[it.slug]
    if (!next) {
        results.push({ id: it.id, slug: it.slug, skip: true })
        continue
    }
    const updated = await it.setAttributes({ slug: next })
    results.push({ id: it.id, from: it.slug, to: updated?.slug || next })
}

const again = await col.getItems()
console.log(
    JSON.stringify(
        { results, slugs: again.map((it) => it.slug) },
        null,
        2
    )
)

function val(v) {
    if (v && typeof v === "object" && "value" in v) return v.value
    return v
}
function img(v) {
    const raw = val(v)
    if (!raw) return null
    if (typeof raw === "string") return { url: raw, alt: "" }
    return { url: raw.url || raw.src || "", alt: String(raw.alt || raw.altText || "").trim() }
}
function rows(v) {
    const raw = val(v)
    return Array.isArray(raw) ? raw : []
}

const col = await framer.getCollection("amTC8pcIG")
const fields = await col.getFields()
const items = await col.getItems()
const idByName = Object.fromEntries(fields.map((f) => [f.name, f.id]))

const extra = items.map((item) => {
    const d = item.fieldData || {}
    const g2 = rows(d[idByName["Gallery 2"]])
    return {
        slug: item.slug,
        credits: [1, 2, 3].map((n) => ({
            label: val(d[idByName[`Credit ${n} Label`]]),
            value: val(d[idByName[`Credit ${n} Value`]]),
        })),
        tags: [1, 2, 3].map((n) => val(d[idByName[`Tag ${n}`]])),
        date: val(d[idByName.Date]),
        dateLabel: val(d[idByName["Date Label"]]),
        type: val(d[idByName.Type]),
        featured: val(d[idByName.Featured]),
        bodyLen: String(val(d[idByName.Body]) || "").length,
        gallery2: g2.length,
        cover: img(d[idByName.Cover])?.url,
        stills: rows(d[idByName.Gallery]).map((r) => img(r.fieldData?.ZkP9UsFFL || Object.values(r.fieldData || {})[0])?.url),
    }
})

function walkBinds(n, pagePath, acc) {
    const a = n.attributes || {}
    const blob = JSON.stringify(a)
    if (/variable-|collectionList|KF94|WTTAa|lmTMqy|visible\.from/.test(blob)) {
        acc.push({
            pagePath,
            id: n.id,
            type: n.type,
            name: a.name,
            collectionList: a.collectionList,
            text: typeof a.text === "string" && String(a.text).includes("var(") ? a.text : undefined,
            visible: a.visible,
            src: a.backgrounds || a.fill || a.image,
            controls: Object.fromEntries(
                Object.entries(a).filter(([k]) => k.startsWith("$control__") && /var\(|WTTAa|KF94|Gallery/.test(JSON.stringify(a[k])))
            ),
        })
    }
    for (const c of n.children || []) walkBinds(c, pagePath, acc)
    return acc
}

const pages = [
    ["augiA20Il", "/"],
    ["fpoP3kuA4", "/work/:Work"],
    ["nizhx6wAX", "/404"],
]
const binds = []
for (const [id, path] of pages) {
    const tree = await framer.agent.serialize({ id, depth: 12 }, { pagePath: path })
    walkBinds(tree, path, binds)
}

const typeField = fields.find((f) => f.name === "Type")

console.log(
    JSON.stringify(
        {
            typeField,
            extra,
            bindHits: binds.filter((b) => b.collectionList || b.text || Object.keys(b.controls).length || b.visible),
        },
        null,
        2
    )
)

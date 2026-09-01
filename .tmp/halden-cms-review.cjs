function val(v) {
    if (v && typeof v === "object" && "value" in v) return v.value
    return v
}

function img(v) {
    const raw = val(v)
    if (!raw) return null
    if (typeof raw === "string") return { url: raw, alt: "" }
    return {
        url: raw.url || raw.src || "",
        alt: String(raw.alt || raw.altText || "").trim(),
        w: raw.width || raw.naturalWidth,
        h: raw.height || raw.naturalHeight,
    }
}

function galleryRows(v) {
    const raw = val(v)
    if (Array.isArray(raw)) return raw
    if (raw && Array.isArray(raw.value)) return raw.value
    return []
}

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const cols = await framer.getCollections()
const collections = []
for (const col of cols) {
    const fields = await col.getFields()
    const items = await col.getItems()
    collections.push({
        id: col.id,
        name: col.name,
        slug: col.slug,
        itemCount: items.length,
        fields: fields.map((f) => ({
            id: f.id,
            name: f.name,
            type: f.type,
            required: f.required,
        })),
        items,
        fieldIndex: Object.fromEntries(fields.map((f) => [f.name, f])),
    })
}

const work = collections.find((c) => c.name === "Work")
if (!work) throw new Error("No Work collection")

const byName = work.fieldIndex
function fieldId(name) {
    return byName[name]?.id
}

const names = work.fields.map((f) => f.name)
const reportItems = work.items.map((item) => {
    const d = item.fieldData || {}
    const cover = img(d[fieldId("Cover")] || d.KF94WDLfr)
    const galField = fieldId("Gallery") || "WTTAaEd5y"
    const rows = galleryRows(d[galField])
    const stills = rows.map((row, i) => {
        const fd = row.fieldData || row
        const imageField =
            fd.ZkP9UsFFL ||
            fd[fieldId("Image")] ||
            Object.values(fd).find((x) => img(x)?.url)
        const image = img(imageField)
        return {
            i,
            rowId: row.id,
            url: image?.url || "",
            alt: image?.alt || "",
            ok: Boolean(image?.url),
        }
    })
    const title = String(val(d[fieldId("Title")] || d.lmTMqy_0B) || "").trim()
    const year = val(d[fieldId("Year")] || d.KKPJSa2Nk)
    const type = val(d[fieldId("Type")] || d.ZMWV4jFbG)
    const desc = String(val(d[fieldId("Description")] || d.blc_46opK) || "").trim()
    const body = val(d[fieldId("Body")] || d.GgZlSrsxB)
    const featured = val(d[fieldId("Featured")] || d.LrPrf7_RQ)
    const location = val(d[fieldId("Location")])
    const client = val(d[fieldId("Client")])
    const yearLabel = val(d[fieldId("Year Label")])
    return {
        id: item.id,
        slug: item.slug,
        draft: item.draft,
        title,
        year,
        type,
        desc,
        descLen: desc.length,
        bodyKind: body == null ? "empty" : typeof body,
        featured,
        location,
        client,
        yearLabel,
        cover,
        stills,
        stillN: stills.length,
        stillOk: stills.filter((s) => s.ok).length,
    }
})

const allUrls = []
for (const it of reportItems) {
    if (it.cover?.url) allUrls.push({ kind: "cover", slug: it.slug, url: it.cover.url, alt: it.cover.alt })
    for (const s of it.stills) {
        if (s.url) allUrls.push({ kind: `still-${s.i}`, slug: it.slug, url: s.url, alt: s.alt })
    }
}

const urlCounts = {}
for (const u of allUrls) {
    urlCounts[u.url] = (urlCounts[u.url] || 0) + 1
}
const duplicateUrls = Object.entries(urlCounts).filter(([, n]) => n > 1)

const issues = []
if (collections.length !== 1) issues.push(`expected 1 collection, got ${collections.map((c) => c.name).join(",")}`)
const slugs = reportItems.map((i) => i.slug)
const dupSlugs = slugs.filter((s, i) => slugs.indexOf(s) !== i)
if (dupSlugs.length) issues.push(`duplicate slugs ${dupSlugs.join(",")}`)

for (const it of reportItems) {
    if (!it.title) issues.push(`${it.slug}: missing title`)
    if (!it.slug) issues.push(`${it.id}: missing slug`)
    if (!it.cover?.url) issues.push(`${it.slug}: missing cover`)
    if (it.stillN < 4) issues.push(`${it.slug}: gallery ${it.stillN} < 4`)
    if (it.stillOk < it.stillN) issues.push(`${it.slug}: ${it.stillN - it.stillOk} empty stills`)
    if (!it.desc) issues.push(`${it.slug}: empty description`)
    if (it.descLen && it.descLen < 40) issues.push(`${it.slug}: description short (${it.descLen})`)
    if (/vale|lorem|placeholder|unsplash|red room/i.test(`${it.title} ${it.desc} ${it.slug}`)) {
        issues.push(`${it.slug}: leftover copy`)
    }
    if (it.cover?.url && it.stills.some((s) => s.url === it.cover.url)) {
        issues.push(`${it.slug}: cover reused as still`)
    }
}

console.log(
    JSON.stringify(
        {
            project: info.name,
            collections: collections.map((c) => ({
                id: c.id,
                name: c.name,
                itemCount: c.itemCount,
                fields: c.fields,
            })),
            items: reportItems.map((it) => ({
                slug: it.slug,
                title: it.title,
                year: it.year,
                type: it.type,
                featured: it.featured,
                descLen: it.descLen,
                desc: it.desc,
                bodyKind: it.bodyKind,
                location: it.location,
                client: it.client,
                coverAlt: it.cover?.alt,
                coverUrl: it.cover?.url?.slice(-48),
                stillN: it.stillN,
                stillAlts: it.stills.map((s) => s.alt),
                stillTails: it.stills.map((s) => (s.url || "").slice(-40)),
            })),
            duplicateUrls: duplicateUrls.map(([url, n]) => ({ n, tail: url.slice(-48) })),
            issues,
        },
        null,
        2
    )
)

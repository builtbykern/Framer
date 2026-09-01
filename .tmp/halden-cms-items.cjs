const col = await framer.getCollection("amTC8pcIG")
const fields = await col.getFields()
const items = await col.getItems()

function briefField(f) {
    return {
        id: f.id,
        name: f.name,
        type: f.type,
    }
}

function briefItem(item) {
    const data = item.fieldData || {}
    const gallery = data.WTTAaEd5y || data.wTTAaEd5y
    const cover = data.KF94WDLfr
    return {
        id: item.id,
        slug: item.slug,
        coverType: cover && (cover.type || typeof cover),
        coverUrl: cover?.value?.url || cover?.url || cover?.src || cover?.value?.src,
        galleryLen: Array.isArray(gallery)
            ? gallery.length
            : Array.isArray(gallery?.value)
              ? gallery.value.length
              : gallery,
        gallery0: Array.isArray(gallery?.value)
            ? gallery.value[0]
            : Array.isArray(gallery)
              ? gallery[0]
              : undefined,
    }
}

console.log(
    JSON.stringify(
        {
            fields: fields.map(briefField),
            items: items.map(briefItem),
        },
        null,
        2
    ).slice(0, 12000)
)

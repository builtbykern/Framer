const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const work = (await framer.getCollections()).find((c) => c.name === "Work")
const fields = await work.getFields()
const items = await work.getItems()
const salt = items.find((i) => i.slug === "salt-light") || items[0]
const gal = salt.fieldData?.WTTAaEd5y

console.log(
    JSON.stringify(
        {
            fields: fields.map((f) => ({
                id: f.id,
                name: f.name,
                type: f.type,
                nested: f.fields || f.type === "array" ? f : undefined,
            })),
            saltSlug: salt.slug,
            galleryType: gal && typeof gal,
            galleryPreview: JSON.stringify(gal)?.slice(0, 1500),
        },
        null,
        2
    )
)

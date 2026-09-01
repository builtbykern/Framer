const col = await framer.getCollection("VPfyI5Rxz")
const fields = await col.getFields()
const nh = fields.find((f) => f.name === "Neighbourhood")
const items = await col.getItems()
const sample = items.map((it) => ({
    slug: it.slug,
    nhField: it.fieldData?.[nh.id],
}))
console.log(
    JSON.stringify(
        { nhId: nh.id, nhType: nh.type, required: nh.required, sample },
        null,
        2,
    ),
)

// What changed on Home unpublished?
const preview = await framer.agent.publish({ action: "preview" })
console.log("preview", JSON.stringify(preview.changes, null, 2))

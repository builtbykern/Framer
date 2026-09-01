const fs = require("fs")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const pagePath = "/work/:Work"
const work = (await framer.getCollections()).find((c) => c.name === "Work")
if (!work) throw new Error("Work missing")

const existing = await work.getFields()
const have = Object.fromEntries(existing.map((f) => [f.name, f]))
const wanted = ["Still 1", "Still 2", "Still 3", "Still 4"]
const created = []
for (const name of wanted) {
    if (have[name]) {
        created.push({ name, id: have[name].id, existed: true })
        continue
    }
    const tempId = `stillField${name.replace(/\s+/g, "")}`
    const r = await framer.agent.applyChanges(
        `+Variable ${tempId} name="${name}" type="image" scope="${work.id}";`,
        { pagePath: "/" }
    )
    created.push({
        name,
        tempId,
        renamedIds: r.renamedIds,
        errors: r.errors,
        message: r.message,
        id: r.renamedIds?.[tempId] || tempId,
        existed: false,
    })
}

const fieldsNow = await work.getFields()
const stillFields = wanted.map((name) => {
    const f = fieldsNow.find((x) => x.name === name)
    return { name, id: f?.id, type: f?.type }
})

const items = await work.getItems()
const migrated = []
for (const item of items) {
    const gal = item.fieldData?.WTTAaEd5y
    const rows = Array.isArray(gal?.value) ? gal.value : []
    const fieldData = {}
    stillFields.forEach((field, i) => {
        if (!field.id) return
        const img = rows[i]?.fieldData?.ZkP9UsFFL?.value || rows[i]?.fieldData?.ZkP9UsFFL
        if (!img) return
        fieldData[field.id] = { type: "image", value: img }
    })
    if (Object.keys(fieldData).length) {
        await item.setAttributes({ fieldData })
    }
    migrated.push({
        slug: item.slug,
        keys: Object.keys(fieldData),
        alts: stillFields.map((field, i) => {
            const img = rows[i]?.fieldData?.ZkP9UsFFL?.value
            return img?.altText || img?.alt || null
        }),
    })
}

const src = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Series_Stills.tsx",
    "utf8"
)
const file = await framer.getCodeFile("Series_Stills.tsx")
await file.setFileContent(src)
const typeErrors = await file.typecheck({ strict: true })

const controls = await framer.agent.getComponentControls({
    componentIds: ["codeFile/jeA2cvO:default"],
})

console.log(
    JSON.stringify(
        {
            collectionId: work.id,
            created,
            stillFields,
            migrated,
            typeErrors,
            controlKeys: Object.keys(controls?.["codeFile/jeA2cvO:default"] || controls || {}),
            controlsRaw: JSON.stringify(controls).slice(0, 4000),
        },
        null,
        2
    )
)

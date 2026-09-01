const fs = require("fs")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const work = (await framer.getCollections()).find((c) => c.name === "Work")
if (!work) throw new Error("Work missing")

const existing = await work.getFields()
const have = Object.fromEntries(existing.map((f) => [f.name, f]))
const wanted = ["Still 1", "Still 2", "Still 3", "Still 4"]
const created = []
for (const name of wanted) {
    if (have[name]) {
        created.push({ name, id: have[name].id, existed: true, type: have[name].type })
        continue
    }
    const tempId = `stillField${name.replace(/\s+/g, "")}`
    const r = await framer.agent.applyChanges(
        `+Variable ${tempId} name="${name}" type="image" scope="${work.id}";`,
        { pagePath: "/" }
    )
    created.push({
        name,
        errors: r.errors,
        message: r.message,
        renamedIds: r.renamedIds,
        existed: false,
    })
}

const fieldsNow = await work.getFields()
const stillFields = wanted.map((name) => {
    const f = fieldsNow.find((x) => x.name === name)
    return { name, id: f?.id, type: f?.type }
})

const sample = (await work.getItems())[0]
const cover = sample?.fieldData?.KF94WDLfr

console.log(
    JSON.stringify(
        {
            collectionId: work.id,
            created,
            stillFields,
            coverSample: cover,
            galleryFirst:
                sample?.fieldData?.WTTAaEd5y?.value?.[0]?.fieldData?.ZkP9UsFFL,
        },
        null,
        2
    )
)

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const work = (await framer.getCollections()).find((c) => c.name === "Work")
if (!work || work.id !== "amTC8pcIG") throw new Error(`Work id ${work?.id}`)

const existing = await work.getFields()
const have = Object.fromEntries(existing.map((f) => [f.name, f.id]))
const wanted = ["Caption 1", "Caption 2", "Caption 3", "Caption 4"]
const createParts = []
wanted.forEach((name, i) => {
    if (have[name]) return
    createParts.push(
        `+Variable capField${i + 1} name="${name}" type="string" scope="${work.id}";`
    )
})
let created = { renamedIds: {}, message: "skipped" }
if (createParts.length) {
    created = await framer.agent.applyChanges(createParts.join(" "), { pagePath: "/" })
    if (created?.errors && Object.keys(created.errors).length) {
        throw new Error(`create captions: ${JSON.stringify(created.errors)}`)
    }
}

const fieldsNow = await work.getFields()
const capIds = wanted.map((name) => {
    const id = fieldsNow.find((f) => f.name === name)?.id
    if (!id) throw new Error(`missing ${name}`)
    return id
})

const stillIds = ["YDvzMtarJ", "e_xsxTDiE", "sFlCMgFPv", "YgsGo3UQv"]
function altOf(item, fieldId) {
    const raw = item.fieldData?.[fieldId]
    const v = raw?.value || raw
    return String(v?.alt || v?.altText || "").trim()
}
function pad(i) {
    return String(i + 1).padStart(2, "0")
}
function esc(s) {
    return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')
}

const items = await work.getItems()
const populate = items
    .map((item) =>
        capIds
            .map((capId, i) => {
                const alt = altOf(item, stillIds[i])
                const text = alt ? `${pad(i)}  ·  ${alt}` : pad(i)
                return `SET ${item.id} $control__${capId}="${esc(text)}";`
            })
            .join(" ")
    )
    .join(" ")

const populated = await framer.agent.applyChanges(populate, { pagePath: "/" })
if (populated?.errors && Object.keys(populated.errors).length) {
    throw new Error(`populate captions: ${JSON.stringify(populated.errors)}`)
}

const pagePath = "/work/:Work"
const capNodes = ["luKFLN0T4", "SN5v6c7F8", "vbn33y5kF", "gzGSFMFmp"]
const bind = capNodes
    .map((nodeId, i) => `SET ${nodeId} text="var(--variable-${capIds[i]})";`)
    .join(" ")
const bound = await framer.agent.applyChanges(bind, { pagePath })
if (bound?.errors && Object.keys(bound.errors).length) {
    throw new Error(`bind captions: ${JSON.stringify(bound.errors)}`)
}

const cap1 = await framer.agent.getNode({ id: "luKFLN0T4" }, { pagePath })
const salt = items.find((i) => i.slug === "salt-light")
console.log(
    JSON.stringify(
        {
            capIds,
            createdMessage: created.message,
            renamed: created.renamedIds,
            populatedMessage: populated.message,
            boundMessage: bound.message,
            cap1Text: cap1?.attributes?.text,
            saltSample: capIds.map((id) => salt?.fieldData?.[id]),
        },
        null,
        2
    )
)

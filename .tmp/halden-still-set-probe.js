const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const work = (await framer.getCollections()).find((c) => c.name === "Work")
const stillIds = ["YDvzMtarJ", "e_xsxTDiE", "sFlCMgFPv", "YgsGo3UQv"]
const items = await work.getItems()
const first = items[0]
const gal = first.fieldData?.WTTAaEd5y?.value?.[0]?.fieldData?.ZkP9UsFFL?.value
const url = gal?.url

const attempts = []
const dsls = [
    `SET ${first.id} $control__${stillIds[0]}="${url}";`,
    `SET ${first.id} $control__${stillIds[0]}.src="${url}";`,
    `SET ${first.id} $control__${stillIds[0]}.src="${url}" $control__${stillIds[0]}.alt="${gal.altText}";`,
]
for (const dsl of dsls) {
    const r = await framer.agent.applyChanges(dsl, { pagePath: "/" })
    attempts.push({ dsl: dsl.slice(0, 180), errors: r.errors, message: r.message })
}

let plugin = null
try {
    await first.setAttributes({
        fieldData: {
            [stillIds[0]]: { type: "image", value: url },
        },
    })
    plugin = { ok: true }
} catch (e) {
    plugin = { ok: false, err: String(e).slice(0, 400) }
}

const reload = await work.getItems()
const again = reload.find((i) => i.id === first.id)

console.log(
    JSON.stringify(
        {
            item: first.id,
            slug: first.slug,
            url,
            attempts,
            plugin,
            still1: again?.fieldData?.YDvzMtarJ,
        },
        null,
        2
    )
)

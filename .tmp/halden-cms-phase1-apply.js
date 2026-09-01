const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const work = (await framer.getCollections()).find((c) => c.name === "Work")
const items = await work.getItems()
const bySlug = Object.fromEntries(items.map((i) => [i.slug, i.id]))

const off = ["night-atlas", "ferry-hour"]
for (const slug of off) {
    if (!bySlug[slug]) throw new Error(`missing ${slug}`)
}

const unfeature = off
    .map((slug) => `SET ${bySlug[slug]} $control__LrPrf7_RQ="false";`)
    .join(" ")

const unfeatured = await framer.agent.applyChanges(unfeature, { pagePath: "/" })
if (unfeatured?.errors && Object.keys(unfeatured.errors).length) {
    throw new Error(`unfeature: ${JSON.stringify(unfeatured.errors)}`)
}

const grouped = await framer.agent.applyChanges(
    `+Divider lookbookDiv name="Lookbook" scope="amTC8pcIG" index="18"; DEL WTTAaEd5y; SET xmBenkfAk name="Drift source — do not delete";`,
    { pagePath: "/" }
)

const fieldsNow = await work.getFields()
const itemsNow = await work.getItems()
const featuredNow = itemsNow.map((i) => ({
    slug: i.slug,
    featured: i.fieldData?.LrPrf7_RQ?.value ?? i.fieldData?.LrPrf7_RQ,
}))

const list = await framer.agent.getNode({ id: "xmBenkfAk" }, { pagePath: "/" })

console.log(
    JSON.stringify(
        {
            unfeatured: unfeatured.message,
            grouped: grouped.message,
            groupedErrors: grouped.errors,
            renamed: grouped.renamedIds,
            listName: list?.name,
            fields: fieldsNow.map((f) => ({ name: f.name, type: f.type, id: f.id })),
            featuredNow,
            featuredCount: featuredNow.filter((f) => f.featured === true).length,
        },
        null,
        2
    )
)

const info = await framer.getProjectInfo()
if (info.name !== "Fair Platform") throw new Error(info.name)

let items = []
try {
    items = await framer.getCollectionItems("t2sbY17Aq")
} catch (e) {
    try {
        items = await framer.getItems("t2sbY17Aq")
    } catch (e2) {
        items = { err: String(e), err2: String(e2) }
    }
}

const pieceMeta = await framer.agent.serializeNodes({
    ids: ["FZFYEKdG1", "g1ctSOgfg", "iR0ECI6Dz", "augiA20Il", "yAd2lMDSW"],
    depth: 0,
    attributeFilter: [
        "metadata.title",
        "metadata.description",
        "appearEffect",
        "htmlTag",
        "padding",
        "layoutTemplate",
        "altText",
    ],
})

const phone = await framer.agent.serializeNodes(
    { ids: ["u75vHQkAR"], depth: 2, attributeFilter: ["id", "name", "stackDirection", "overflow", "htmlTag", "padding"] },
    { pagePath: "/" }
)

function summarizeItems(raw) {
    if (!Array.isArray(raw)) return raw
    return raw.map((it) => ({
        id: it.id,
        slug: it.slug || it.attributes?.slug,
        title: it.title || it.attributes?.title || it.name,
    }))
}

console.log(
    JSON.stringify(
        {
            project: info.name,
            items: summarizeItems(items),
            pieceMeta,
            phoneKids: phone[0]?.children?.map((c) => ({
                id: c.id,
                name: c.name,
                type: c.type,
                stackDirection: c.attributes?.stackDirection,
                htmlTag: c.attributes?.htmlTag,
                padding: c.attributes?.padding,
            })),
        },
        null,
        2
    )
)

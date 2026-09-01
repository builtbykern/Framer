const info = await framer.getProjectInfo()
if (info.name !== "Fair Platform") throw new Error(info.name)

const pages = await framer.agent.serializeNodes({
    ids: ["augiA20Il", "FZFYEKdG1", "eT5aUzOXW", "pTPGQ4L6O", "GPILtKFJP"],
    depth: 0,
    attributeFilter: ["id", "name", "path", "layoutTemplate", "metadata.title", "metadata.description"],
})

const home = await framer.agent.serializeNodes(
    {
        ids: ["WQLkyLRf1", "yAd2lMDSW", "YuQho50Zq", "omF0gODuR", "OdvHkNWXz"],
        depth: 2,
        attributeFilter: [
            "id",
            "name",
            "padding",
            "gap",
            "fontSize",
            "width",
            "height",
            "overflow",
            "stackDirection",
            "appearEffect",
            "htmlTag",
            "altText",
        ],
    },
    { pagePath: "/" }
)

const detail = await framer.agent.serializeNodes(
    {
        ids: ["g1ctSOgfg", "iR0ECI6Dz", "dKIZmzj_1", "yBOTItE1V"],
        depth: 1,
        attributeFilter: ["id", "name", "padding", "gap", "appearEffect", "height", "htmlTag", "altText"],
    },
    { pagePath: "/piece/:Piece" }
)

const card = await framer.agent.serializeNodes({
    ids: ["OdvHkNWXz"],
    depth: 2,
    attributeFilter: ["id", "name"],
})

let collections = []
try {
    collections = await framer.getCollections()
} catch (e) {
    collections = [{ error: String(e) }]
}

function texts(nodes, acc = []) {
    const list = Array.isArray(nodes) ? nodes : [nodes]
    for (const n of list) {
        if (!n) continue
        const t = n.attributes?.text
        if (typeof t === "string" && t.trim()) acc.push({ id: n.id, name: n.name, text: t.slice(0, 140) })
        if (n.children) texts(n.children, acc)
    }
    return acc
}

const copyPages = await framer.agent.serializeNodes({
    ids: ["WQLkyLRf1", "tVu2ncruf", "J1kd1wjJe", "pWw0UM2JG", "dKIZmzj_1"],
    depth: 5,
    attributeFilter: ["id", "name", "text"],
})
const allText = texts(copyPages)
const hay = JSON.stringify(allText).toLowerCase()
const leftovers = ["glass hours", "halden", "lorem", "ipsum", "quarto", "shopify", "fair platform"].filter((n) =>
    hay.includes(n)
)

console.log(
    JSON.stringify(
        {
            project: info.name,
            pages,
            home,
            detail,
            cardVariants: card,
            collections: Array.isArray(collections)
                ? collections.map((c) => ({ id: c.id, name: c.name, itemCount: c.itemIds?.length || c.items?.length }))
                : collections,
            leftovers,
            allText,
        },
        null,
        2
    )
)

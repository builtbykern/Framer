function walk(node, acc = []) {
    if (!node) return acc
    const a = node.attributes || {}
    acc.push({
        id: node.id,
        type: node.type,
        name: node.name || a.name,
        collection: a.collectionList?.collection,
        parent: node.$parentId,
        left: a.left,
        width: a.width,
    })
    for (const c of node.children || []) walk(c, acc)
    return acc
}

const home = await framer.agent.serializeNodes({
    ids: ["augiA20Il"],
    depth: 3,
})
const lists = []
function findLists(node) {
    if (!node) return
    const cl = node.attributes?.collectionList
    if (cl) lists.push({ id: node.id, name: node.name, cl, parent: node.$parentId })
    for (const c of node.children || []) findLists(c)
}
findLists(home[0])

const planes = await framer.agent.serializeNodes({
    ids: ["RV7bjlgdh"],
    depth: 0,
    attributeFilter: ["$control__workList"],
})

console.log(
    JSON.stringify(
        {
            lists,
            planeSlot: planes[0]?.attributes,
            pageKids: (home[0]?.children || []).map((c) => ({
                id: c.id,
                name: c.name,
                type: c.type,
                left: c.attributes?.left,
            })),
        },
        null,
        2
    )
)

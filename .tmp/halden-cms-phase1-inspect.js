const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const pagePath = "/"
const list = await framer.agent.getNode({ id: "xmBenkfAk" }, { pagePath })
const listFull = await framer.agent.serializeNodes(
    { ids: ["xmBenkfAk"], depth: 4 },
    { pagePath }
)

const workPage = await framer.agent.serializeNodes(
    { ids: ["rT9WGdFVR"], depth: 5, attributeFilter: ["name", "text", "visible"] },
    { pagePath: "/work/:Work" }
)

function findText(n, acc = []) {
    const t = n.attributes?.text
    if (t) acc.push({ id: n.id, name: n.name, text: t })
    for (const c of n.children || []) findText(c, acc)
    return acc
}

const collections = await framer.agent.getNodesOfTypes({ types: ["CollectionNode"] })
const workNode = (collections?.nodes || collections || []).find((c) => c.name === "Work")
const workSer = workNode
    ? await framer.agent.serialize({ id: workNode.id, depth: 1, attributeFilter: ["name"] })
    : null

const work = (await framer.getCollections()).find((c) => c.name === "Work")
const fields = await work.getFields()

console.log(
    JSON.stringify(
        {
            listAttrs: list?.attributes,
            listKeys: Object.keys(list?.attributes || {}),
            collectionList: Object.fromEntries(
                Object.entries(list?.attributes || {}).filter(([k]) =>
                    k.startsWith("collectionList")
                )
            ),
            listTree: JSON.stringify(listFull).slice(0, 4000),
            workBindings: findText(workPage?.[0] || {}),
            collectionId: workNode?.id || work?.id,
            fieldOrder: fields.map((f, i) => ({
                i,
                id: f.id,
                name: f.name,
                type: f.type,
            })),
            workSerVars: (workSer?.variables || []).map((v) => ({
                id: v.id,
                name: v.name,
                type: v.type,
            })),
        },
        null,
        2
    )
)

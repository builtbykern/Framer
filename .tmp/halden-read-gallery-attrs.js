const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const pagePath = "/work/:Work"
const list = await framer.agent.getNode({ id: "lktcbNgBF" }, { pagePath })
const ser = await framer.agent.serializeNodes(
    { ids: ["lktcbNgBF", "MI_ZHE7kH", "yn0nMGJJL"], depth: 5 },
    { pagePath }
)

console.log(
    JSON.stringify(
        {
            listAttrs: list?.attributes,
            collectionList: list?.attributes?.collectionList,
            ser: ser.map((n) => ({
                id: n.id,
                name: n.name,
                collectionList: n.attributes?.collectionList,
                children: (n.children || []).map((c) => ({
                    id: c.id,
                    name: c.name,
                    type: c.type,
                    collectionList: c.attributes?.collectionList,
                    fill: c.attributes?.fill,
                    kids: (c.children || []).map((k) => ({
                        id: k.id,
                        name: k.name,
                        type: k.type,
                        fill: k.attributes?.fill,
                        collectionList: k.attributes?.collectionList,
                    })),
                })),
            })),
        },
        null,
        2
    )
)

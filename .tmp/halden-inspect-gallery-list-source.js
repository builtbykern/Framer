const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const list = await framer.agent.getNode(
    { id: "lktcbNgBF" },
    { pagePath: "/work/:Work" }
)
const a = list?.attributes || {}
const collectionKeys = Object.keys(a).filter((k) =>
    /collection|repeat|filter|gallery|source|data/i.test(k)
)

const ser = await framer.agent.serializeNodes(
    { ids: ["yn0nMGJJL", "lktcbNgBF"], depth: 4 },
    { pagePath: "/work/:Work" }
)

let docs = null
try {
    docs = await framer.agent.getImplementationGuide?.("CMS Collection Lists")
} catch (e) {
    docs = String(e)
}

console.log(
    JSON.stringify(
        {
            project: info.name,
            listType: list?.type,
            collectionKeys,
            collectionList: a.collectionList,
            allAttrKeys: Object.keys(a),
            docsType: typeof docs,
            docsPreview:
                typeof docs === "string"
                    ? docs.slice(0, 4000)
                    : JSON.stringify(docs)?.slice(0, 4000),
            galleryKids: ser[0]?.children?.map((c) => ({
                id: c.id,
                name: c.name,
                type: c.type,
                collectionList: c.attributes?.collectionList,
            })),
        },
        null,
        2
    )
)

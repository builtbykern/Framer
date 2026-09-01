const info = await framer.getProjectInfo()
if (info.name !== "Fair Platform") throw new Error(info.name)

const tree = await framer.agent.serializeNodes({
    ids: ["augiA20Il", "FZFYEKdG1", "eT5aUzOXW", "pTPGQ4L6O", "GPILtKFJP", "yAd2lMDSW", "u75vHQkAR", "WQLkyLRf1", "t2sbY17Aq", "IhgjBMpmC"],
    depth: 3,
    attributeFilter: [
        "name",
        "path",
        "layoutTemplate",
        "$layoutTemplateId",
        "overflow",
        "hideScrollbars",
        "stackDirection",
        "collectionList",
        "text",
        "link",
        "codeFile",
        "htmlTag",
    ],
})

function walk(nodes, fn) {
    for (const n of nodes || []) {
        fn(n)
        if (n.children) walk(n.children, fn)
    }
}

const leftovers = []
const needles = ["Glass Hours", "Halden", "Quarto", "Mill Ledger", "letterpress", "lorem", "Lorem", "ipsum", "bench"]
walk(tree, (n) => {
    const t = n.attributes?.text
    const s = typeof t === "string" ? t : t ? JSON.stringify(t) : ""
    for (const needle of needles) {
        if (s.includes(needle)) leftovers.push({ id: n.id, name: n.name, needle, text: s.slice(0, 160) })
    }
})

const col = await framer.getCollection("t2sbY17Aq")
const items = await col.getItems()
const stills = items.map((it) => ({
    id: it.id,
    slug: it.slug,
    title: it.fieldData?.Rjsd6qD9G?.value || it.fieldData?.Rjsd6qD9G,
    still: it.fieldData?.BM_bNm1MI?.value?.id || it.fieldData?.BM_bNm1MI?.id,
    cover: it.fieldData?.pZepVvnAD?.value?.id || it.fieldData?.pZepVvnAD?.id,
}))

const emptyHits = []
walk(tree, (n) => {
    if (String(n.name || "").toLowerCase().includes("empty") || String(n.name || "").toLowerCase().includes("no ")) {
        emptyHits.push({ id: n.id, name: n.name, type: n.type, text: n.attributes?.text })
    }
})

let emptyNodes = []
try {
    emptyNodes = await framer.agent.getDescendantsOfTypes({
        id: "yAd2lMDSW",
        types: ["RichTextNode", "FrameNode"],
    })
} catch (e) {
    emptyNodes = String(e)
}

console.log(
    JSON.stringify(
        {
            project: info.name,
            pages: tree
                .filter((n) => n.type === "WebPageNode")
                .map((p) => ({
                    id: p.id,
                    name: p.name,
                    path: p.attributes?.path,
                    layout: p.attributes?.layoutTemplate ?? null,
                    tid: p.attributes?.$layoutTemplateId ?? null,
                })),
            homeKids: tree.find((n) => n.id === "WQLkyLRf1")?.children?.map((c) => ({ name: c.name, type: c.type })),
            phoneKids: tree.find((n) => n.id === "u75vHQkAR")?.children?.map((c) => ({
                name: c.name,
                type: c.type,
                cl: c.attributes?.collectionList?.collection,
                overflow: c.attributes?.overflow,
                hide: c.attributes?.hideScrollbars,
                dir: c.attributes?.stackDirection,
            })),
            list: tree.find((n) => n.id === "yAd2lMDSW")?.attributes,
            navType: tree.find((n) => n.id === "IhgjBMpmC")?.type,
            leftovers,
            slugs: items.map((it) => it.slug),
            stills,
            emptyHits,
            emptyNodeSample: Array.isArray(emptyNodes)
                ? emptyNodes.slice(0, 30).map((n) => ({ id: n.id, name: n.name, type: n.type }))
                : emptyNodes,
        },
        null,
        2
    )
)

const info = await framer.getProjectInfo()
if (info.name !== "Fair Platform") {
    throw new Error(`Wrong project: ${info.name}`)
}

const pages = await framer.agent.serializeNodes({
    ids: ["augiA20Il", "FZFYEKdG1", "eT5aUzOXW", "pTPGQ4L6O", "GPILtKFJP"],
    depth: 0,
})

const homeBps = await framer.agent.serializeNodes({
    ids: ["WQLkyLRf1", "t62LHpSTa", "u75vHQkAR"],
    depth: 2,
    attributeFilter: [
        "name",
        "layoutTemplate",
        "collectionList",
        "overflow",
        "hideScrollbars",
        "stackDirection",
        "metadata",
        "title",
        "description",
    ],
})

console.log(
    JSON.stringify(
        {
            project: info.name,
            pages: pages.map((p) => ({
                id: p.id,
                name: p.name,
                path: p.attributes?.path,
                layout: p.attributes?.layoutTemplate,
                meta: p.attributes?.metadata,
                title: p.attributes?.title,
                description: p.attributes?.description,
            })),
            bps: homeBps.map((n) => ({
                id: n.id,
                name: n.name,
                kids: n.children?.map((c) => ({
                    id: c.id,
                    name: c.name,
                    type: c.type,
                    cl: c.attributes?.collectionList,
                    overflow: c.attributes?.overflow,
                    hide: c.attributes?.hideScrollbars,
                    dir: c.attributes?.stackDirection,
                })),
            })),
        },
        null,
        2
    )
)

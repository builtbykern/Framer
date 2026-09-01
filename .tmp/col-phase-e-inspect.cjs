const layout = await framer.agent.serializeNodes({
    ids: ["XhOTMh5M9", "augiA20Il", "w02dlXciD", "o8zGdtVCK"],
    depth: 2,
})
const placeholders = await framer.agent.getDescendantsOfTypes({
    id: "XhOTMh5M9",
    types: ["PlaceholderNode"],
})
const home = await framer.agent.serializeNodes({
    ids: ["WQLkyLRf1"],
    depth: 1,
})
console.log(
    JSON.stringify(
        {
            layoutName: layout[0]?.name,
            layoutKids: layout[0]?.children?.map((c) => ({
                id: c.id,
                type: c.type,
                name: c.name,
                attrs: {
                    width: c.attributes?.width,
                    height: c.attributes?.height,
                    fill: c.attributes?.fill,
                },
                kids: c.children?.map((k) => ({
                    id: k.id,
                    type: k.type,
                    name: k.name,
                })),
            })),
            homeMeta: {
                layoutTemplate: layout[1]?.attributes?.layoutTemplate,
                layoutId: layout[1]?.$layoutTemplateId,
                breakpoints: layout[1]?.$breakpoints,
            },
            workMeta: {
                layoutId: layout[2]?.$layoutTemplateId,
                path: layout[2]?.attributes?.path,
            },
            infoMeta: { layoutId: layout[3]?.$layoutTemplateId },
            placeholders,
            homeDesk: home[0]?.attributes,
        },
        null,
        2
    )
)

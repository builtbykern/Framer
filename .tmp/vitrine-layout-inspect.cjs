const info = await framer.getProjectInfo()
if (info.name !== "Fair Platform") throw new Error(info.name)

const detail = await framer.agent.serializeNodes({
    ids: ["dKIZmzj_1", "WQLkyLRf1", "omF0gODuR"],
    depth: 3,
    attributeFilter: ["name", "visible", "gap", "padding", "height", "width", "textStylePreset", "stackDirection"],
})

console.log(
    JSON.stringify(
        {
            homeKids: detail.find((n) => n.id === "WQLkyLRf1")?.children?.map((c) => ({
                id: c.id,
                name: c.name,
                type: c.type,
            })),
            squareKids: detail.find((n) => n.id === "omF0gODuR")?.children?.map((c) => ({
                id: c.id,
                name: c.name,
                visible: c.attributes?.visible,
                h: c.attributes?.height,
            })),
            detailKids: detail.find((n) => n.id === "dKIZmzj_1")?.children?.map((c) => ({
                id: c.id,
                name: c.name,
                type: c.type,
                kids: c.children?.map((g) => ({ id: g.id, name: g.name, type: g.type })),
            })),
        },
        null,
        2
    )
)

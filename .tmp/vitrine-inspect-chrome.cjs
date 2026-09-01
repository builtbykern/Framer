const info = await framer.getProjectInfo()
if (info.name !== "Fair Platform") throw new Error(`Wrong project: ${info.name}`)

const nav = await framer.agent.serializeNodes({
    ids: ["IhgjBMpmC", "GiR6fF7o5", "QhfNwiny9", "omF0gODuR", "yAd2lMDSW", "O2btPltNw", "aIET_2yab"],
    depth: 3,
    attributeFilter: [
        "name",
        "gap",
        "padding",
        "width",
        "height",
        "fill",
        "textStylePreset",
        "linkStylePreset",
        "stackDirection",
        "stackAlignment",
        "overflow",
        "hideScrollbars",
    ],
})

const styles = await framer.agent.getNodesOfTypes({ types: ["LinkStylePresetNode"] })

console.log(
    JSON.stringify(
        {
            project: info.name,
            nav: nav.map((n) => ({
                id: n.id,
                name: n.name,
                type: n.type,
                a: n.attributes,
                kids: n.children?.map((c) => ({
                    id: c.id,
                    name: c.name,
                    type: c.type,
                    a: c.attributes,
                    kids: c.children?.map((g) => ({
                        id: g.id,
                        name: g.name,
                        type: g.type,
                        a: g.attributes,
                    })),
                })),
            })),
            links: styles,
        },
        null,
        2
    )
)

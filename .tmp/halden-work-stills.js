const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const stills = await framer.agent.getNode(
    { id: "afUswAq7g" },
    { pagePath: "/work/:Work" }
)
const gallery = await framer.agent.getNode(
    { id: "yn0nMGJJL" },
    { pagePath: "/work/:Work" }
)
const surface = await framer.agent.getNode(
    { id: "i_pl00Sun" },
    { pagePath: "/work/:Work" }
)
const field = await framer.agent.getNode(
    { id: "MI_ZHE7kH" },
    { pagePath: "/work/:Work" }
)

function attrs(n) {
    const a = n?.attributes || {}
    return {
        id: n?.id,
        name: n?.name,
        layout: a.layout,
        layoutDirection: a.layoutDirection,
        gap: a.gap,
        padding: a.padding,
        width: a.width,
        height: a.height,
        overflow: a.overflow,
        position: a.position,
        visible: a.visible,
        backgroundColor: a.backgroundColor,
        stackAlignment: a.stackAlignment,
        stackDistribution: a.stackDistribution,
    }
}

console.log(
    JSON.stringify(
        {
            project: info.name,
            surface: attrs(surface),
            gallery: attrs(gallery),
            field: attrs(field),
            stills: {
                ...attrs(stills),
                componentIdentifier: stills?.componentIdentifier,
                controls: stills?.controls,
            },
        },
        null,
        2
    )
)

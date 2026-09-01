const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const pagePath = "/work/:Work"
const tree = await framer.agent.serializeNodes(
    { ids: ["bOI4aJofa", "VXfJdwtze", "YWDE8tH3l", "kc7BoVgP0"], depth: 6 },
    { pagePath }
)

function slim(n) {
    const a = n.attributes || {}
    return {
        id: n.id,
        name: n.name,
        type: n.type,
        fill: a.fill,
        visible: a.visible,
        width: a.width,
        height: a.height,
        gap: a.gap,
        htmlTag: a.htmlTag,
        overflow: a.overflow,
        layout: a.layout,
        stackDirection: a.stackDirection,
        stackDistribution: a.stackDistribution,
        stackAlignment: a.stackAlignment,
        text: a.text,
        textStylePreset: a.textStylePreset,
        textColor: a.textColor,
        textAlignment: a.textAlignment,
        children: (n.children || []).map(slim),
    }
}

console.log(JSON.stringify(tree.map(slim), null, 2))

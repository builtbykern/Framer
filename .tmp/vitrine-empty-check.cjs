const nodes = await framer.agent.serializeNodes({
    ids: ["yAd2lMDSW", "t62LHpSTayAd2lMDSW", "u75vHQkARyAd2lMDSW", "QOtlLO_kh", "R2pga7_AP", "t62LHpSTa", "u75vHQkAR"],
    depth: 1,
    attributeFilter: ["name", "overflow", "hideScrollbars", "height", "text", "visible", "stackDirection"],
})
console.log(
    JSON.stringify(
        nodes.map((n) => ({
            id: n.id,
            name: n.name,
            a: n.attributes,
            kids: n.children?.map((c) => c.name),
        })),
        null,
        2
    )
)

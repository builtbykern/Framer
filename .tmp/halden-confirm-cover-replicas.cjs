const nodes = await framer.agent.serializeNodes({
    ids: [
        "lgPBjlVA8",
        "LSqc1L2WHlgPBjlVA8",
        "Tf2mbU7BvlgPBjlVA8",
        "afUswAq7g",
        "RV7bjlgdh",
        "xmBenkfAk",
    ],
    depth: 0,
    attributeFilter: [
        "fill",
        "$control__cover",
        "$control__workList",
        "left",
        "width",
        "height",
    ],
})
console.log(JSON.stringify(nodes, null, 2).slice(0, 6000))

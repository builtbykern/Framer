await framer.agent.readProject(
    [{ type: "implementation-guide-from-index", name: "Effects" }],
    { pagePath: "/" }
)

const rule = await framer.agent.serializeNodes({
    ids: ["eGJAoz6x_", "yZes1fNVs", "GiR6fF7o5", "QYwZhiOCq", "aDU_xPLrv"],
    depth: 0,
    attributeFilter: [
        "name",
        "layout",
        "position",
        "top",
        "left",
        "height",
        "width",
        "overflow",
        "gap",
        "appearEffect",
        "fill",
    ],
})

console.log(JSON.stringify(rule, null, 2))

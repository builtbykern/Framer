const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const ser = await framer.agent.serialize(
    {
        id: "FddpNYFNF",
        depth: 2,
        attributeFilter: [
            "name",
            "height",
            "width",
            "overflow",
            "visible",
            "lineClamp",
            "maxLines",
            "text",
            "fontSize",
            "lineHeight",
            "truncation",
        ],
    },
    { pagePath: "/" }
)

console.log(JSON.stringify({ project: info.name, ser }, null, 2).slice(0, 12000))

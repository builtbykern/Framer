const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const type = await framer.agent.getNode({ id: "FddpNYFNF" }, { pagePath: "/" })
const title = await framer.agent.getNode({ id: "GAokM9PPJ" }, { pagePath: "/" })
const label = await framer.agent.getNode({ id: "tpUu5gNAo" }, { pagePath: "/" })
console.log(
    JSON.stringify(
        {
            project: info.name,
            type: {
                fontSize: type?.attributes?.fontSize,
                overflow: type?.attributes?.overflow,
                lineHeight: type?.attributes?.lineHeight,
            },
            title: { overflow: title?.attributes?.overflow },
            stillsLabel: { visible: label?.attributes?.visible },
        },
        null,
        2
    )
)

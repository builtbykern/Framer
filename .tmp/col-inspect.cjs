const info = await framer.getProjectInfo()
const pages = await framer.getNodesWithType?.("WebPageNode")
const sitemap = await framer.agent.getNodesOfTypes(
    { types: ["WebPageNode", "CollectionNode", "LayoutTemplateNode"] },
    { pagePath: "/" }
)
console.log(
    JSON.stringify(
        {
            info,
            sitemap: (sitemap || []).map((n) => ({
                id: n.id,
                name: n.name,
                type: n.type,
                path: n.path,
            })),
        },
        null,
        2
    )
)

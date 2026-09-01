const ctx = await framer.agent.getContext({ pagePath: "/" })
console.log(
    JSON.stringify(
        {
            siteMap: ctx.siteMap || ctx["site-map"],
            pages: ctx.pages,
            selected: ctx.selected,
        },
        null,
        2
    ).slice(0, 4000)
)

const nodes = await framer.agent.getNodesOfTypes(
    { types: ["WebPageNode", "FrameNode"] },
    { pagePath: "/" }
)
console.log(
    "nodes",
    JSON.stringify(nodes, null, 2).slice(0, 6000)
)

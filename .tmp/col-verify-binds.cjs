const now = await framer.agent.serializeNodes(
    {
        ids: ["Q6fE1RPzM", "Fyj0MwAfG", "KnMOObwVE", "WQcnJ55Ok"],
        depth: 0,
        attributeFilter: [
            "overflow",
            "height",
            "width",
            "padding",
            "gap",
            "visible",
            "link",
            "$control__variant",
            "$control__title",
            "$control__slug",
            "$control__cover",
            "collectionList",
        ],
    },
    { pagePath: "/" }
)
console.log(JSON.stringify(now, null, 2))

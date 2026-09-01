const info = await framer.getProjectInfo()
if (info.name !== "Halden" && !String(info.name).includes("Beet") && !String(info.name).includes("Halden")) {
    // Higher Beet is the live Halden file
}

const planes = await framer.agent.serializeNodes(
    {
        ids: ["RV7bjlgdh", "BjqrvIntTRV7bjlgdh", "nyI5jW7lARV7bjlgdh"],
        depth: 0,
        attributeFilter: [
            "$control__workList",
            "$control__view",
            "$control__images",
            "$control__cMS",
            "width",
            "height",
            "component",
        ],
    },
    { pagePath: "/" }
)

const slot = await framer.agent.serializeNodes(
    {
        ids: ["H9TnltXVB", "augiA20Il"],
        depth: 2,
        attributeFilter: [
            "name",
            "left",
            "top",
            "width",
            "height",
            "visible",
            "collectionList",
            "fill",
            "link",
            "component",
        ],
    },
    { pagePath: "/" }
)

const veils = await framer.agent.getNodesOfTypes({
    types: ["ComponentInstanceNode", "CodeComponentNode"],
})

console.log(
    JSON.stringify(
        {
            project: { name: info.name, id: info.id },
            planes,
            slotBrief: slot,
            instanceNames: (veils || [])
                .filter((n) => {
                    const d = n.$componentDisplayName || n.component
                    return (
                        String(d).includes("Veil") ||
                        String(d).includes("Drift") ||
                        String(n.name || "").includes("Veil")
                    )
                })
                .map((n) => ({
                    id: n.id,
                    name: n.name,
                    display: n.$componentDisplayName,
                    component: n.component,
                    parent: n.$parentId,
                })),
        },
        null,
        2
    ).slice(0, 18000)
)

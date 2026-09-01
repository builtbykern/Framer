const card = await framer.agent.serializeNodes({
    ids: ["PzdF7MhGJ"],
    depth: 0,
})
const cluster = await framer.agent.serializeNodes({
    ids: ["aBz9LPj8U"],
    depth: 0,
})
const rename = await framer.agent.applyChanges(
    'SET aBz9LPj8U name="Cluster";',
    { pagePath: "/" }
)
const after = await framer.agent.readComponentControls({
    componentIds: ["PzdF7MhGJ"],
})
console.log(
    JSON.stringify(
        {
            variants: card[0]?.$variants,
            clusterName: cluster[0]?.name,
            rename,
            afterVariant: after.PzdF7MhGJ?.controls?.$control__variant,
        },
        null,
        2
    )
)

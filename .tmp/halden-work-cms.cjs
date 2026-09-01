const cols = await framer.agent.getNodesOfTypes({
    types: ["CollectionNode"],
})
const work = cols.find((c) => c.name === "Work" || c.attributes?.name === "Work")
const serialized = work
    ? await framer.agent.serializeNodes({ ids: [work.id], depth: 0 })
    : null

console.log(
    JSON.stringify(
        {
            collections: cols.map((c) => ({ id: c.id, name: c.name })),
            workVars: serialized?.[0]?.variables,
        },
        null,
        2
    )
)

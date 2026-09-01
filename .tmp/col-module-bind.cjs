const item = await framer.agent.serializeNodes({
    ids: ["PzpZpW56b", "MSQ8xjrcA", "Fyj0MwAfG", "KnMOObwVE", "Q6fE1RPzM"],
    depth: 1,
})
const moduleVar = await framer.agent.serializeNodes({
    ids: ["TVImviktM"],
    depth: 0,
})
console.log(
    JSON.stringify(
        {
            glass: item[0]?.attributes,
            unmade: item[1]?.attributes,
            inst: item[2]?.attributes,
            wrap: item[3]?.attributes,
            listCL: item[4]?.attributes?.collectionList,
            moduleVar,
        },
        null,
        2
    )
)

const home = await framer.agent.serializeNodes({
    ids: ["augiA20Il"],
    depth: 4,
})
const card = await framer.agent.serializeNodes({
    ids: ["PzdF7MhGJ"],
    depth: 1,
})
const controls = await framer.agent.readComponentControls({
    componentIds: ["PzdF7MhGJ"],
})
const year = await framer.agent.serializeNodes({
    ids: ["Zmp43mQJT", "is8kAge_X"],
    depth: 1,
})
console.log(
    JSON.stringify(
        {
            home,
            cardVars: card[0]?.variables,
            cardName: card[0]?.name,
            controls,
            yearAttrs: year[0]?.attributes,
            squareAttrs: year[1]?.attributes,
        },
        null,
        2
    )
)

const card = await framer.agent.serializeNodes({
    ids: ["PzdF7MhGJ"],
    depth: 1,
})
const year = await framer.agent.serializeNodes({
    ids: ["Zmp43mQJT", "OrlcC44h0"],
    depth: 1,
})
const pages = await framer.agent.listPages()
const controls = await framer.agent.readComponentControls({
    componentIds: ["PzdF7MhGJ"],
})
console.log(
    JSON.stringify(
        {
            vars: card[0]?.variables,
            year: year[0]?.attributes,
            cover: year[1]?.attributes,
            pages,
            controls,
        },
        null,
        2
    )
)

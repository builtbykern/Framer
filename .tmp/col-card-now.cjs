const card = await framer.agent.serializeNodes({
    ids: ["PzdF7MhGJ"],
    depth: 3,
})
const controls = await framer.agent.readComponentControls({
    componentIds: ["PzdF7MhGJ"],
})
console.log(JSON.stringify({ card, controls }, null, 2).slice(0, 12000))

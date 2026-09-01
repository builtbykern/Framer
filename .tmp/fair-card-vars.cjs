const card = await framer.agent.serializeNodes({
    ids: ["OdvHkNWXz"],
    depth: 0,
})
const controls = await framer.agent.readComponentControls({
    componentIds: ["OdvHkNWXz"],
})
console.log(
    JSON.stringify(
        { vars: card[0]?.variables, variants: card[0]?.$variants, controls },
        null,
        2
    )
)

const card = await framer.agent.serializeNodes({
    ids: ["OdvHkNWXz", "augiA20Il", "v:BU8_2gg2U:0:0", "axW_NfbLI"],
    depth: 0,
})
const vars = card[0]?.variables?.map((v) => ({
    id: v.id,
    name: v.name,
    initialValue: v.initialValue,
}))
console.log(
    JSON.stringify(
        {
            vars,
            home: {
                name: card[1]?.name,
                attrs: card[1]?.attributes,
            },
            t404: card[2],
            body404: card[3],
        },
        null,
        2
    )
)

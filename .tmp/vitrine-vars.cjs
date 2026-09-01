const card = await framer.agent.serializeNodes({
    ids: ["OdvHkNWXz"],
    depth: 0,
})
const extra = card[0] || {}
console.log(
    JSON.stringify(
        {
            keys: Object.keys(extra),
            children: extra.children?.map((c) => ({
                type: c.type,
                id: c.id,
                name: c.name,
                initialValue: c.attributes?.initialValue,
            })),
            attrs: extra.attributes,
            variables: extra.variables,
        },
        null,
        2
    )
)

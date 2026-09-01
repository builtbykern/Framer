const items = await framer.agent.serializeNodes({
    ids: [
        "lkZBIAg86",
        "tZytgw_pu",
        "N8rSuGdDW",
        "vWwUi2iXi",
        "EDUlD2m19",
        "RXZYU_SGB",
        "X3kJRxUxX",
        "zyvPp0qI0",
        "augiA20Il",
    ],
    depth: 0,
})
console.log(
    JSON.stringify(
        {
            homeKeys: Object.keys(items[8]?.attributes || {}),
            home: items[8]?.attributes,
            rows: items.slice(0, 8).map((n) => ({
                id: n.id,
                title: n.attributes?.$control__title,
                cover: n.attributes?.$control__cover?.alt,
                still: n.attributes?.$control__still?.alt,
                coverSrc: n.attributes?.$control__cover?.src?.slice(-40),
            })),
        },
        null,
        2
    )
)

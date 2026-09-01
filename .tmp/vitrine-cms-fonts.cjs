const info = await framer.getProjectInfo()
if (info.name !== "Fair Platform") throw new Error(info.name)

const items = await framer.agent.serializeNodes({
    ids: ["tZytgw_pu", "lkZBIAg86", "RXZYU_SGB", "EDUlD2m19", "vWwUi2iXi", "X3kJRxUxX", "zyvPp0qI0", "N8rSuGdDW"],
    depth: 0,
    attributeFilter: [
        "id",
        "name",
        "$control__Rjsd6qD9G",
        "$control__N_XD2ACYK",
        "$control__docaG2WpK",
        "draft",
    ],
})

const styles = await framer.getTextStyles?.()
const fonts = await framer.agent.serializeNodes({
    ids: ["dPXgkd9PP", "nzsp03Fh5", "t5y0e5eot", "BEFvspdZd", "XhPTwnrNB"],
    depth: 0,
    attributeFilter: ["id", "name", "fontName"],
})

const houseT = await framer.agent.serializeNodes(
    { ids: ["hRNnw_VA2", "EU24xAeMI", "XX7urzdEP", "XCr9mFaYB"], depth: 2, attributeFilter: ["id", "name", "width", "padding", "text"] },
    { pagePath: "/info" }
)

console.log(
    JSON.stringify(
        {
            project: info.name,
            items,
            fonts,
            styleKeys: styles ? Object.keys(styles).slice(0, 20) : null,
            houseT,
        },
        null,
        2
    )
)

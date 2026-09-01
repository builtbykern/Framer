const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

function url(res, i) {
    const row = res?.results?.[i]
    return row?.image_url || row?.url || row?.error || null
}

const title = await framer.agent.serialize(
    {
        id: "GAokM9PPJ",
        depth: 0,
        attributeFilter: ["name", "text", "fontName", "fontSize"],
    },
    { pagePath: "/" }
)
const year = await framer.agent.serialize(
    {
        id: "XwtyrQVdF",
        depth: 0,
        attributeFilter: ["name", "text", "fontName"],
    },
    { pagePath: "/" }
)
const type = await framer.agent.serialize(
    {
        id: "FddpNYFNF",
        depth: 0,
        attributeFilter: ["name", "text", "fontName"],
    },
    { pagePath: "/" }
)

const home = await framer.agent.readProject(
    [
        { type: "screenshot", id: "WQLkyLRf1" },
        { type: "screenshot", id: "BjqrvIntT" },
        { type: "screenshot", id: "nyI5jW7lA" },
    ],
    { pagePath: "/" }
)
const work = await framer.agent.readProject(
    [{ type: "screenshot", id: "rtJNTCNFr" }],
    { pagePath: "/work/:Work" }
)
const four = await framer.agent.readProject(
    [{ type: "screenshot", id: "nACIEuvcP" }],
    { pagePath: "/404" }
)

console.log(
    JSON.stringify(
        {
            project: info.name,
            title: title?.attributes || title,
            year: year?.attributes || year,
            type: type?.attributes || type,
            shots: {
                homeD: url(home, 0),
                homeT: url(home, 1),
                homeP: url(home, 2),
                workD: url(work, 0),
                fourD: url(four, 0),
            },
        },
        null,
        2
    )
)

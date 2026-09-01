const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)
const work = await framer.agent.readProject(
    [
        { type: "screenshot", id: "rtJNTCNFr" },
        { type: "screenshot", id: "Tf2mbU7Bv" },
    ],
    { pagePath: "/work/:Work" }
)
const home = await framer.agent.readProject(
    [{ type: "screenshot", id: "WQLkyLRf1" }],
    { pagePath: "/" }
)
console.log(
    JSON.stringify(
        {
            project: info.name,
            workDesktop: work.results?.[0]?.image_url,
            workPhone: work.results?.[1]?.image_url,
            homeDesktop: home.results?.[0]?.image_url,
        },
        null,
        2
    )
)

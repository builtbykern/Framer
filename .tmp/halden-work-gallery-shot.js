const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const shots = await framer.agent.readProject(
    [
        { type: "screenshot", id: "yn0nMGJJL" },
        { type: "screenshot", id: "afUswAq7g" },
        { type: "screenshot", id: "LSqc1L2WH" },
    ],
    { pagePath: "/work/:Work" }
)
console.log(
    JSON.stringify(
        {
            project: info.name,
            gallery: shots.results?.[0]?.image_url,
            stills: shots.results?.[1]?.image_url,
            tablet: shots.results?.[2]?.image_url,
        },
        null,
        2
    )
)

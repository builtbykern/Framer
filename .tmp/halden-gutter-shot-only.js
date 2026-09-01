const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)
const shots = await framer.agent.readProject(
    [{ type: "screenshot", id: "BjqrvIntT" }],
    { pagePath: "/" }
)
console.log(
    JSON.stringify(
        { project: info.name, tablet: shots.results?.[0]?.image_url },
        null,
        2
    )
)

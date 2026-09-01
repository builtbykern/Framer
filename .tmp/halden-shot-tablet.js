const shots = await framer.agent.readProject(
    [{ type: "screenshot", id: "BjqrvIntT" }],
    { pagePath: "/" }
)
console.log(
    JSON.stringify(
        {
            project: (await framer.getProjectInfo()).name,
            tablet: shots.results?.[0]?.image_url,
        },
        null,
        2
    )
)

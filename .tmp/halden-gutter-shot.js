const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)
const files = await framer.getCodeFiles()
const drift = files.find((f) => f.id === "Og5966a")
const driftTc = await drift.typecheck()
const shots = await framer.agent.readProject(
    [{ type: "screenshot", id: "BjqrvIntT" }],
    { pagePath: "/" }
)
console.log(
    JSON.stringify(
        { project: info.name, driftTc, tablet: shots.results?.[0]?.image_url },
        null,
        2
    )
)

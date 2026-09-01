const guide = await framer.agent.readProject(
    [{ type: "implementation-guide-from-index", name: "CMS Collection Lists" }],
    { pagePath: "/" }
)
console.log(JSON.stringify(guide, null, 2))

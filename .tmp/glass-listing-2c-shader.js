const shader = await framer.agent.serialize(
    { id: "x7Brh3AOX", depth: 0 },
    { pagePath: "/thumbnail" }
)
console.log("shader", JSON.stringify(shader, null, 2).slice(0, 2500))

const grain = await framer.agent.serialize(
    { id: "BNf3pbYg_", depth: 0 },
    { pagePath: "/thumbnail" }
)
console.log("grain", JSON.stringify(grain, null, 2).slice(0, 1200))

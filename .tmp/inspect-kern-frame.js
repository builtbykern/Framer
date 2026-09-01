const kicker = await framer.agent.serialize(
    { id: "vtGuOmqMv", depth: 3 },
    { pagePath: "/" }
)
const card = await framer.agent.getNode({ id: "Ticm7kYDN" }, { pagePath: "/" })
const desk = await framer.agent.getNode({ id: "WQLkyLRf1" }, { pagePath: "/" })
console.log("kicker", JSON.stringify(kicker, null, 2).slice(0, 2500))
console.log("card", JSON.stringify(card, null, 2).slice(0, 1500))
console.log("desk", JSON.stringify(desk, null, 2).slice(0, 1500))

const desk = await framer.agent.serialize(
    { id: "WQLkyLRf1", depth: 2, attributeFilter: ["fill", "layout", "padding", "gap", "width", "height", "name"] },
    { pagePath: "/" }
)
console.log(JSON.stringify(desk, null, 2).slice(0, 4000))

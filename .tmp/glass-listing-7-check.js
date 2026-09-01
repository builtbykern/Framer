const inst = await framer.agent.serialize(
    { id: "qmDll42hM", depth: 0 },
    { pagePath: "/" }
)
console.log("motion", inst.attributes?.["$control__motion"])
console.log("rect", inst.$rect)

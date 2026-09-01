const thumb = await framer.agent.serialize(
    { id: "dT5f2Oq6P", depth: 0 },
    { pagePath: "/thumbnail" }
)
console.log("thumb motion", thumb.attributes?.["$control__motion"])

const r = await framer.agent.applyChanges(
    [
        "DEL qmDll42hM;",
        '+ComponentInstanceNode glassHome component="codeFile/c1HYdAH:default" parent="J6H0w3tE9" index="1";',
        'SET glassHome name="Glass Type" width="960px" height="444px";',
    ].join("\n"),
    { pagePath: "/" }
)
console.log("recreate", JSON.stringify(r).slice(0, 800))

const list = await framer.agent.serializeNodes({
    ids: ["WQLkyLRf1", "yAd2lMDSW", "t62LHpSTayAd2lMDSW", "u75vHQkARyAd2lMDSW"],
    depth: 0,
    attributeFilter: [
        "name",
        "overflow",
        "hideScrollbars",
        "height",
        "width",
        "stackDirection",
        "collectionList",
    ],
})
console.log(JSON.stringify(list, null, 2))

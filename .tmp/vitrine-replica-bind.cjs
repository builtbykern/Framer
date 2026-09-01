const info = await framer.getProjectInfo()
if (info.name !== "Fair Platform") throw new Error(info.name)

const nodes = await framer.agent.serializeNodes({
    ids: [
        "yAd2lMDSW",
        "t62LHpSTayAd2lMDSW",
        "u75vHQkARyAd2lMDSW",
        "O2btPltNw",
        "t62LHpSTaO2btPltNw",
        "u75vHQkARO2btPltNw",
        "aIET_2yab",
        "t62LHpSTaaIET_2yab",
        "u75vHQkARaIET_2yab",
    ],
    depth: 1,
    attributeFilter: [
        "name",
        "collectionList",
        "$control__title",
        "$control__date",
        "$control__description",
        "$control__cover",
        "$control__still",
        "$control__variant",
        "link",
        "stackDirection",
        "width",
        "height",
    ],
})

console.log(
    JSON.stringify(
        nodes.map((n) => ({
            id: n.id,
            name: n.name,
            type: n.type,
            a: n.attributes,
        })),
        null,
        2
    )
)

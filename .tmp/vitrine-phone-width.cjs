const info = await framer.getProjectInfo()
if (info.name !== "Fair Platform") throw new Error(info.name)

const phoneCard = await framer.agent.serializeNodes(
    {
        ids: ["u75vHQkARaIET_2yab", "u75vHQkARO2btPltNw", "u75vHQkARyAd2lMDSW", "BZgqwOKfT", "omF0gODuR"],
        depth: 1,
        attributeFilter: ["id", "name", "width", "height", "maxWidth", "overflow", "stackDirection"],
    },
    { pagePath: "/" }
)

const fields = await framer.agent.serializeNodes({
    ids: ["t2sbY17Aq"],
    depth: 2,
    attributeFilter: ["id", "name", "type"],
})

const homePage = await framer.agent.serializeNodes({
    ids: ["augiA20Il"],
    depth: 0,
    attributeFilter: ["id", "name", "path", "layoutTemplate"],
})

console.log(JSON.stringify({ project: info.name, phoneCard, fields, homePage }, null, 2))

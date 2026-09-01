const guides = await framer.agent.readProject(
    [
        { type: "implementation-guide-from-index", name: "CMS Collection Lists" },
        { type: "implementation-guide-from-index", name: "CMS Detail Pages" },
        { type: "implementation-guide-from-index", name: "Typography" },
        {
            type: "font-search",
            query: "quiet catalogue display serif and mono label",
            limit: 6,
            mustHave: ["serif"],
        },
        { type: "font-search", name: "Instrument Serif" },
        { type: "font-search", name: "IBM Plex Mono" },
        { type: "font-search", name: "Source Serif 4" },
    ],
    { pagePath: "/" }
)

const list = await framer.agent.serializeNodes({
    ids: [
        "WQLkyLRf1",
        "yAd2lMDSW",
        "t62LHpSTayAd2lMDSW",
        "u75vHQkARyAd2lMDSW",
        "augiA20Il",
        "FZFYEKdG1",
        "eT5aUzOXW",
        "pTPGQ4L6O",
        "QhfNwiny9",
        "KVgGkkS4z",
        "ViBjWFaCI",
        "aqpa10Il4",
    ],
    depth: 1,
    attributeFilter: [
        "name",
        "overflow",
        "hideScrollbars",
        "height",
        "width",
        "stackDirection",
        "layoutTemplate",
        "collectionList",
        "text",
        "fill",
        "padding",
        "gap",
    ],
})

console.log(
    JSON.stringify(
        {
            guideTypes: guides?.results?.map((r) => r.type || r.name),
            fonts: guides?.results?.filter((r) => r.type === "font-search"),
            list,
        },
        null,
        2
    )
)

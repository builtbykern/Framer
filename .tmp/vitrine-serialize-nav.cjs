const info = await framer.getProjectInfo()
if (info.name !== "Fair Platform") throw new Error(info.name)

const nav = await framer.agent.serializeNodes({
    ids: ["IhgjBMpmC"],
    depth: 4,
    attributeFilter: [
        "id",
        "name",
        "__class",
        "text",
        "padding",
        "gap",
        "width",
        "height",
        "fontSize",
        "textStylePreset",
        "link",
        "borderBottom",
        "stackDirection",
        "layoutTemplate",
        "overflow",
        "hideScrollbars",
        "codeFile",
        "component",
    ],
})

const homePage = await framer.agent.serializeNodes(
    {
        ids: ["augiA20Il", "WQLkyLRf1", "t62LHpSTa", "u75vHQkAR", "NBF_dDp3H"],
        depth: 3,
        attributeFilter: [
            "id",
            "name",
            "__class",
            "layoutTemplate",
            "overflow",
            "hideScrollbars",
            "stackDirection",
            "codeFile",
            "component",
            "collection",
        ],
    },
    { pagePath: "/" }
)

const house = await framer.agent.serializeNodes(
    { ids: ["eT5aUzOXW", "tVu2ncruf"], depth: 4, attributeFilter: ["id", "name", "__class", "text", "layoutTemplate"] },
    { pagePath: "/info" }
)
const desk = await framer.agent.serializeNodes(
    { ids: ["pTPGQ4L6O", "J1kd1wjJe"], depth: 4, attributeFilter: ["id", "name", "__class", "text", "layoutTemplate"] },
    { pagePath: "/contact" }
)
const four = await framer.agent.serializeNodes(
    { ids: ["GPILtKFJP", "pWw0UM2JG"], depth: 4, attributeFilter: ["id", "name", "__class", "text", "layoutTemplate"] },
    { pagePath: "/404" }
)

function texts(nodes, acc = []) {
    if (!nodes) return acc
    const list = Array.isArray(nodes) ? nodes : [nodes]
    for (const n of list) {
        if (!n) continue
        if (typeof n.text === "string" && n.text.trim()) acc.push({ id: n.id, name: n.name, text: n.text.slice(0, 160) })
        if (n.children) texts(n.children, acc)
        if (n.nodes) texts(n.nodes, acc)
    }
    return acc
}

console.log(
    JSON.stringify(
        {
            project: info.name,
            nav,
            homePage,
            houseTexts: texts(house),
            deskTexts: texts(desk),
            fourTexts: texts(four),
            houseRaw: house,
            deskRaw: desk,
            fourRaw: four,
        },
        null,
        2
    )
)

const info = await framer.getProjectInfo()
if (info.name !== "Fair Platform") throw new Error(info.name)

const card = await framer.agent.serializeNodes({
    ids: ["omF0gODuR", "BZgqwOKfT", "GLlag6b9R", "S4aeyJLQa", "QYwZhiOCq", "aIET_2yab", "O2btPltNw"],
    depth: 1,
    attributeFilter: [
        "id",
        "name",
        "width",
        "height",
        "aspectRatio",
        "fill",
        "link",
        "cursor",
        "hoverEffect",
        "htmlTag",
        "fontName",
        "padding",
        "gap",
    ],
})

const root = await framer.agent.serializeNodes({
    ids: ["rootNode", "Sd0Tbn1jY", "t2sbY17Aq"],
    depth: 1,
    attributeFilter: ["id", "name", "metadata.favicon", "metadata.title", "type"],
})

const pages = await framer.agent.serializeNodes({
    ids: ["augiA20Il", "FZFYEKdG1", "eT5aUzOXW", "pTPGQ4L6O", "GPILtKFJP"],
    depth: 0,
    attributeFilter: ["id", "name", "path", "layoutTemplate"],
})

const fourPhone = await framer.agent.serializeNodes(
    { ids: ["U9F5gXIMe", "XCr9mFaYB"], depth: 2, attributeFilter: ["id", "name", "width", "padding", "text"] },
    { pagePath: "/404" }
)

console.log(JSON.stringify({ project: info.name, card, root, pages, fourPhone }, null, 2))

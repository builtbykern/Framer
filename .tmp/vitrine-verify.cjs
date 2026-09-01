const fs = require("fs")
const path = require("path")
const dir = "/Users/noel/Desktop/Framer/.tmp/vitrine-shots"
fs.mkdirSync(dir, { recursive: true })

const bind = await framer.agent.applyChanges(
    `
SET t62LHpSTayAd2lMDSW collectionList.collection="Piece" overflow="auto" hideScrollbars="true";
SET u75vHQkARyAd2lMDSW collectionList.collection="Piece" overflow="auto" hideScrollbars="true";
SET yAd2lMDSW overflow="auto" hideScrollbars="true" stackDirection="horizontal";
`.replace(/\n+/g, " "),
    { pagePath: "/" }
)

const tree = await framer.agent.serializeNodes({
    ids: [
        "augiA20Il",
        "FZFYEKdG1",
        "eT5aUzOXW",
        "pTPGQ4L6O",
        "GPILtKFJP",
        "WQLkyLRf1",
        "u75vHQkAR",
        "yAd2lMDSW",
        "QhfNwiny9",
        "odgkshwbV",
        "FnQbHIoGD",
        "t2sbY17Aq",
        "lkZBIAg86",
        "tZytgw_pu",
    ],
    depth: 2,
    attributeFilter: [
        "name",
        "path",
        "layoutTemplate",
        "overflow",
        "hideScrollbars",
        "stackDirection",
        "collectionList",
        "text",
        "metadata",
    ],
})

for (const [id, name] of [
    ["WQLkyLRf1", "home-desktop.jpg"],
    ["t62LHpSTa", "home-tablet.jpg"],
    ["u75vHQkAR", "home-phone.jpg"],
    ["tVu2ncruf", "house-desktop.jpg"],
    ["J1kd1wjJe", "desk-desktop.jpg"],
    ["dKIZmzj_1", "piece-desktop.jpg"],
]) {
    const r = await framer.screenshot(id, { format: "jpeg", scale: 1 })
    fs.writeFileSync(path.join(dir, name), r.data)
}

const vekter = await framer.agent.readProject(
    [
        { type: "screenshot", id: "WQLkyLRf1" },
        { type: "screenshot", id: "t62LHpSTa" },
        { type: "screenshot", id: "u75vHQkAR" },
        { type: "screenshot", id: "dKIZmzj_1" },
    ],
    { pagePath: "/" }
)

console.log(
    JSON.stringify(
        {
            bind,
            pages: tree.filter((n) => n.type === "WebPageNode").map((p) => ({
                id: p.id,
                name: p.name,
                path: p.attributes?.path,
                layout: p.attributes?.layoutTemplate,
            })),
            list: {
                name: tree.find((n) => n.id === "yAd2lMDSW")?.name,
                overflow: tree.find((n) => n.id === "yAd2lMDSW")?.attributes?.overflow,
                hide: tree.find((n) => n.id === "yAd2lMDSW")?.attributes?.hideScrollbars,
                dir: tree.find((n) => n.id === "yAd2lMDSW")?.attributes?.stackDirection,
                cl: tree.find((n) => n.id === "yAd2lMDSW")?.attributes?.collectionList,
            },
            phoneKids: tree.find((n) => n.id === "u75vHQkAR")?.children?.map((c) => ({
                name: c.name,
                type: c.type,
                cl: c.attributes?.collectionList?.collection,
                overflow: c.attributes?.overflow,
            })),
            wordmark: tree.find((n) => n.id === "QhfNwiny9")?.attributes?.text,
            house: tree.find((n) => n.id === "odgkshwbV")?.attributes?.text,
            cms: tree.find((n) => n.id === "t2sbY17Aq")?.name,
            item: tree.find((n) => n.id === "lkZBIAg86"),
            vekter,
        },
        null,
        2
    )
)

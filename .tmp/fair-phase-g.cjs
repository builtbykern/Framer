const fs = require("fs")
const path = require("path")
const dir = "/Users/noel/Desktop/Framer/.tmp/fair-shots"
const pages = await framer.agent.getNodesOfTypes({ types: ["WebPageNode"] })
for (const [id, name] of [
    ["dKIZmzj_1", "work-desktop.jpg"],
    ["tVu2ncruf", "info-desktop.jpg"],
    ["J1kd1wjJe", "contact-desktop.jpg"],
    ["pWw0UM2JG", "404-desktop.jpg"],
]) {
    const r = await framer.screenshot(id, { format: "jpeg", scale: 1 })
    fs.writeFileSync(path.join(dir, name), r.data)
}
const inst = await framer.agent.serializeNodes({
    ids: ["aIET_2yab", "yAd2lMDSW"],
    depth: 0,
    attributeFilter: [
        "$control__variant",
        "$control__title",
        "$control__cover",
        "collectionList",
        "link",
        "overflow",
    ],
})
console.log(
    JSON.stringify(
        {
            pages: pages.map((p) => ({
                id: p.id,
                name: p.name,
                path: p.attributes?.path,
            })),
            inst,
        },
        null,
        2
    )
)

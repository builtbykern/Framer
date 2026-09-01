const gallery = await framer.agent.serializeNodes({
    ids: ["yn0nMGJJL", "MI_ZHE7kH", "afUswAq7g", "rT9WGdFVR"],
    depth: 3,
    attributeFilter: [
        "fill",
        "width",
        "height",
        "gap",
        "padding",
        "layout",
        "overflow",
        "collectionList",
        "$control__images",
        "$control__cover",
        "visible",
    ],
})

let collections = null
try {
    collections = await framer.getCollections()
} catch (err) {
    collections = String(err)
}

let items = null
try {
    const cols = Array.isArray(collections) ? collections : []
    const work = cols.find((c) => c.name === "Work" || c.id === "amTC8pcIG")
    if (work && typeof framer.getItems === "function") {
        items = await framer.getItems(work.id)
    } else if (work && typeof framer.getCollectionItems === "function") {
        items = await framer.getCollectionItems(work.id)
    } else {
        items = {
            work,
            keys: collections && typeof collections === "object" ? Object.keys(collections) : null,
            framerKeys: Object.keys(framer).filter((k) => /item|collection/i.test(k)),
        }
    }
} catch (err) {
    items = String(err)
}

const fs = require("fs")
const path = require("path")
const dir = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
const stillShot = await framer.screenshot("afUswAq7g", { format: "jpeg", scale: 1 })
fs.writeFileSync(path.join(dir, "sotd-series-stills.jpg"), stillShot.data)
const infoShot = await framer.screenshot("rT9WGdFVR", { format: "jpeg", scale: 1 })
fs.writeFileSync(path.join(dir, "sotd-work-info.jpg"), infoShot.data)

console.log(
    JSON.stringify(
        {
            gallery,
            collectionsBrief: Array.isArray(collections)
                ? collections.map((c) => ({
                      id: c.id,
                      name: c.name,
                      keys: Object.keys(c),
                  }))
                : collections,
            itemsBrief:
                items && Array.isArray(items)
                    ? items.slice(0, 2)
                    : items,
            stillBytes: stillShot.data.length,
            infoBytes: infoShot.data.length,
        },
        null,
        2
    ).slice(0, 14000)
)

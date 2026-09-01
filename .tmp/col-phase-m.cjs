const fs = require("fs")
const path = require("path")
const dir = "/Users/noel/Desktop/Framer/.tmp/col-shots"

const replica = await framer.agent.serializeNodes(
    {
        ids: [
            "yhVuy25KbFyj0MwAfG",
            "Ktwi4KHu8Fyj0MwAfG",
            "Fyj0MwAfG",
            "yhVuy25KbQ6fE1RPzM",
        ],
        depth: 0,
        attributeFilter: [
            "$control__variant",
            "$control__title",
            "$control__cover",
            "$control__still",
            "$control__date",
            "collectionList",
            "width",
            "height",
            "overflow",
        ],
    },
    { pagePath: "/" }
)

const listShot = await framer.screenshot("yhVuy25KbQ6fE1RPzM", {
    format: "jpeg",
    scale: 1,
})
fs.writeFileSync(path.join(dir, "home-phone-list.jpg"), listShot.data)

const tabList = await framer.screenshot("Ktwi4KHu8Q6fE1RPzM", {
    format: "jpeg",
    scale: 1,
})
fs.writeFileSync(path.join(dir, "home-tablet-list.jpg"), tabList.data)

console.log(
    JSON.stringify(
        {
            replica,
            phoneListBytes: listShot.data.length,
            tabletListBytes: tabList.data.length,
        },
        null,
        2
    )
)

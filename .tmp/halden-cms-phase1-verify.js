const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const moved = await framer.agent.applyChanges(
    `MOVE DtZHJ8qW_ parent="amTC8pcIG" index="12";`,
    { pagePath: "/" }
)

const work = (await framer.getCollections()).find((c) => c.name === "Work")
const fields = await work.getFields()

const fs = require("fs")
const path = require("path")
const outDir = "/Users/noel/Desktop/Framer/.tmp/halden-mkt-shots"
const home = await framer.screenshot("WQLkyLRf1", { format: "png", scale: 1 })
fs.writeFileSync(path.join(outDir, "home-after-featured.png"), home.data)
const workShot = await framer.screenshot("yn0nMGJJL", { format: "png", scale: 1, pagePath: "/work/:Work" })
fs.writeFileSync(path.join(outDir, "work-after-gallery-del.png"), workShot.data)

const galleryGone = !fields.some((f) => f.name === "Gallery")
const stills = await framer.agent.getNode({ id: "GmsqajS3d" }, { pagePath: "/work/:Work" })

console.log(
    JSON.stringify(
        {
            moved: moved.message,
            movedErrors: moved.errors,
            fields: fields.map((f) => f.name),
            galleryGone,
            still1Fill: stills?.attributes?.fill,
            homeBytes: home.data.length,
            workBytes: workShot.data.length,
        },
        null,
        2
    )
)

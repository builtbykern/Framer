const fs = require("fs")
const path = require("path")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const pagePath = "/work/:Work"
const outDir = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
const phone = await framer.agent.getNode({ id: "Tf2mbU7BvafUswAq7g" }, { pagePath })
const r = await framer.screenshot("Tf2mbU7Bvyn0nMGJJL", { format: "png", scale: 1 })
fs.writeFileSync(path.join(outDir, "work-gallery-phone.png"), r.data)

console.log(
    JSON.stringify(
        {
            phoneStills: {
                s1: phone?.attributes?.$control__still1,
                s2: phone?.attributes?.$control__still2,
                images: Boolean(phone?.attributes?.$control__images),
            },
            bytes: r.data.length,
        },
        null,
        2
    )
)

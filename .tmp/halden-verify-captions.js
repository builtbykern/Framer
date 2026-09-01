const fs = require("fs")
const path = require("path")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const work = (await framer.getCollections()).find((c) => c.name === "Work")
const items = await work.getItems()
const capIds = ["l_tVLXw3B", "SA8C3A7bs", "wxF_wUoGY", "oU0l2SQX9"]
const values = items.map((i) => ({
    slug: i.slug,
    caps: capIds.map((id) => {
        const raw = i.fieldData?.[id]
        return raw?.value ?? raw ?? null
    }),
}))

const pagePath = "/work/:Work"
const cap1 = await framer.agent.getNode({ id: "luKFLN0T4" }, { pagePath })
const outDir = "/Users/noel/Desktop/Framer/.tmp/halden-audit"
const galShot = await framer.screenshot("yn0nMGJJL", { format: "png", scale: 1 })
fs.writeFileSync(path.join(outDir, "audit-native-lookbook.png"), galShot.data)
const phoneShot = await framer.screenshot("Tf2mbU7Bvyn0nMGJJL", { format: "png", scale: 1 })
fs.writeFileSync(path.join(outDir, "audit-native-lookbook-phone.png"), phoneShot.data)

console.log(
    JSON.stringify(
        {
            cap1Text: cap1?.attributes?.text,
            values,
            empty: values.filter((v) => v.caps.some((c) => !c)),
            bytes: { gallery: galShot.data.length, phone: phoneShot.data.length },
        },
        null,
        2
    )
)

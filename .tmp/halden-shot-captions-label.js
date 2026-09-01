const fs = require("fs")
const path = require("path")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const pagePath = "/work/:Work"

const typeIds = ["YVFefyZaD", "LSqc1L2WHYVFefyZaD", "Tf2mbU7BvYVFefyZaD"]
const types = []
for (const id of typeIds) {
    const n = await framer.agent.getNode({ id }, { pagePath })
    types.push({
        id,
        found: Boolean(n),
        preset: n?.attributes?.textStylePreset,
        fontName: n?.attributes?.fontName,
    })
}

const outDir = "/Users/noel/Desktop/Framer/.tmp/halden-audit"
const gal = await framer.screenshot("yn0nMGJJL", { format: "png", scale: 1 })
fs.writeFileSync(path.join(outDir, "audit-captions-label.png"), gal.data)
const phone = await framer.screenshot("Tf2mbU7Bvyn0nMGJJL", { format: "png", scale: 1 })
fs.writeFileSync(path.join(outDir, "audit-captions-label-phone.png"), phone.data)

console.log(
    JSON.stringify(
        {
            types,
            bytes: { gal: gal.data.length, phone: phone.data.length },
        },
        null,
        2
    )
)

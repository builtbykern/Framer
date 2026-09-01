const fs = require("fs")
const path = require("path")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const outDir = "/Users/noel/Desktop/Framer/.tmp/halden-audit"
const pagePath = "/work/:Work"

const native = await framer.agent.getNode({ id: "MZykSQ6C5" }, { pagePath })
const r = await framer.screenshot("MZykSQ6C5", { format: "png", scale: 1 })
fs.writeFileSync(path.join(outDir, "audit-native-still1.png"), r.data)
const gal = await framer.screenshot("yn0nMGJJL", { format: "png", scale: 1 })
fs.writeFileSync(path.join(outDir, "audit-gallery-with-native.png"), gal.data)

const home = await framer.agent.serialize(
    { id: "WQLkyLRf1", depth: 5, attributeFilter: ["component", "name"] },
    { pagePath: "/" }
)

function findStills(n, acc = []) {
    if (String(n.component || "").includes("jeA2cvO") || n.name === "Series Stills") {
        acc.push({ id: n.id, name: n.name, parent: n.$parentId })
    }
    for (const c of n.children || []) findStills(c, acc)
    return acc
}

console.log(
    JSON.stringify(
        {
            native: {
                fill: native?.attributes?.fill,
                height: native?.attributes?.height,
                parent: native?.$parentId,
            },
            nativeBytes: r.data.length,
            galleryBytes: gal.data.length,
            homeSeriesStills: findStills(home),
        },
        null,
        2
    )
)

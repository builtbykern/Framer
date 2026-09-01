const fs = require("fs")
const path = require("path")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const pagePath = "/work/:Work"
const removed = await framer.agent.applyChanges(
    `DEL MZykSQ6C5; DEL svCIoIp1F; DEL MI_ZHE7kH;`,
    { pagePath }
)

const gallery = await framer.agent.serializeNodes(
    { ids: ["yn0nMGJJL"], depth: 3, attributeFilter: ["name", "fill", "component", "visible", "width", "gap"] },
    { pagePath }
)

const tabletGal = await framer.agent.getNode({ id: "LSqc1L2WHyn0nMGJJL" }, { pagePath })
const phoneGal = await framer.agent.getNode({ id: "Tf2mbU7Bvyn0nMGJJL" }, { pagePath })
const tabletStill1 = await framer.agent.getNode({ id: "LSqc1L2WHbOI4aJofa" }, { pagePath })
const phoneStill1 = await framer.agent.getNode({ id: "Tf2mbU7BvbOI4aJofa" }, { pagePath })
const leftover = await framer.agent.getNodesOfTypes(
    { types: ["ComponentInstanceNode"] },
    { pagePath }
)
const je = (leftover?.nodes || leftover || []).filter((n) =>
    String(n.component || n.attributes?.component || "").includes("jeA2cvO")
)

const outDir = "/Users/noel/Desktop/Framer/.tmp/halden-audit"
fs.mkdirSync(outDir, { recursive: true })
const galShot = await framer.screenshot("yn0nMGJJL", { format: "png", scale: 1 })
fs.writeFileSync(path.join(outDir, "audit-native-lookbook.png"), galShot.data)
const deskShot = await framer.screenshot("rtJNTCNFr", { format: "png", scale: 1 })
fs.writeFileSync(path.join(outDir, "audit-work-desktop-native.png"), deskShot.data)
const phoneShot = await framer.screenshot("Tf2mbU7Bvyn0nMGJJL", { format: "png", scale: 1 })
fs.writeFileSync(path.join(outDir, "audit-native-lookbook-phone.png"), phoneShot.data)

const kids = (gallery?.[0]?.children || []).map((c) => ({
    id: c.id,
    name: c.name,
    fill: c.attributes?.fill,
    visible: c.attributes?.visible,
}))

console.log(
    JSON.stringify(
        {
            removedMessage: removed?.message,
            removedErrors: removed?.errors,
            kids,
            tabletGal: tabletGal && { width: tabletGal.attributes?.width, gap: tabletGal.attributes?.gap },
            phoneGal: phoneGal && { width: phoneGal.attributes?.width, gap: phoneGal.attributes?.gap },
            tabletStill1: Boolean(tabletStill1),
            phoneStill1: Boolean(phoneStill1),
            leftoverSeriesStills: je.map((n) => ({ id: n.id, name: n.name })),
            bytes: {
                gallery: galShot.data.length,
                desktop: deskShot.data.length,
                phone: phoneShot.data.length,
            },
        },
        null,
        2
    )
)

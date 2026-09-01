const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const pagePath = "/work/:Work"
const styles = await framer.agent.getNodesOfTypes({ types: ["TextStylePresetNode"] })
const nodes = styles?.nodes || styles || []
const label = nodes.find((n) => n.name === "Label" || n.attributes?.name === "Label")
const labelFull = label
    ? await framer.agent.getNode({ id: label.id })
    : null
const cap = await framer.agent.getNode({ id: "luKFLN0T4" }, { pagePath })
const tabletGal = await framer.screenshot("LSqc1L2WHyn0nMGJJL", { format: "png", scale: 1 })
const fs = require("fs")
const path = require("path")
fs.writeFileSync(
    path.join("/Users/noel/Desktop/Framer/.tmp/halden-audit", "audit-native-lookbook-tablet.png"),
    tabletGal.data
)
console.log(
    JSON.stringify(
        {
            labelId: label?.id,
            labelAttrs: labelFull?.attributes,
            capPreset: cap?.attributes?.textStylePreset,
            tabletBytes: tabletGal.data.length,
        },
        null,
        2
    )
)

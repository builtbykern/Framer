const fs = require("fs")
const dir = "/Users/noel/Desktop/Framer/.tmp"
const desk = await framer.screenshot("WQLkyLRf1", { format: "png", scale: 1 })
fs.writeFileSync(`${dir}/glass-no-preview-bg.png`, desk.data)
console.log("desk", desk.data.length)

const node = await framer.agent.getNode({ id: "WQLkyLRf1" }, { pagePath: "/" })
console.log("fill", node?.attributes?.fill)
const inst = await framer.agent.serialize(
    { id: "Ticm7kYDN", depth: 0, attributeFilter: ["$control__preview", "$control__look"] },
    { pagePath: "/" }
)
console.log("instance", JSON.stringify(inst, null, 2).slice(0, 1200))

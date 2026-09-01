const fs = require("fs")
const dir = "/Users/noel/Desktop/Framer/.tmp"
const card = await framer.screenshot("Ticm7kYDN", { format: "png", scale: 1 })
const desk = await framer.screenshot("WQLkyLRf1", { format: "png", scale: 1 })
fs.writeFileSync(`${dir}/glass-alpha-card.png`, card.data)
fs.writeFileSync(`${dir}/glass-alpha-desk.png`, desk.data)
console.log("card", card.data.length, "desk", desk.data.length)
const inst = await framer.agent.serialize(
    { id: "Ticm7kYDN", depth: 0, attributeFilter: ["$control__look", "$control__preview"] },
    { pagePath: "/" }
)
console.log(JSON.stringify(inst.attributes, null, 2).slice(0, 800))

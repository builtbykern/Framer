const fs = require("fs")

await framer.agent.applyChanges(
    [
        'SET WQLkyLRf1 height="1000px" minHeight="1000px";',
        'SET bN4Wnq0cg width="960px" height="444px";',
    ].join("\n"),
    { pagePath: "/" }
)

const dir = "/Users/noel/Desktop/Framer/.tmp"
const card = await framer.screenshot("bN4Wnq0cg", { format: "png", scale: 1 })
const desk = await framer.screenshot("WQLkyLRf1", { format: "png", scale: 1 })
fs.writeFileSync(`${dir}/glass-type-card.png`, card.data)
fs.writeFileSync(`${dir}/glass-type-desk.png`, desk.data)
console.log("card", card.data.length, "desk", desk.data.length)

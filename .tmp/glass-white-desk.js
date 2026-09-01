const result = await framer.agent.applyChanges(
    'SET WQLkyLRf1 fill="white";',
    { pagePath: "/" }
)
console.log(JSON.stringify(result))

const fs = require("fs")
const desk = await framer.screenshot("WQLkyLRf1", { format: "png", scale: 1 })
fs.writeFileSync("/Users/noel/Desktop/Framer/.tmp/glass-alpha-white.png", desk.data)
console.log("desk", desk.data.length)

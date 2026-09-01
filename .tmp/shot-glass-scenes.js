const fs = require("fs")
const dir = "/Users/noel/Desktop/Framer/.tmp"

async function shot(name) {
    const r = await framer.screenshot("bN4Wnq0cg", { format: "png", scale: 1 })
    fs.writeFileSync(`${dir}/${name}`, r.data)
    console.log(name, r.data.length)
}

let result = await framer.agent.applyChanges(
    'SET bN4Wnq0cg $control__motion.mode="ball";',
    { pagePath: "/" }
)
console.log("ball set", JSON.stringify(result).slice(0, 800))
await shot("glass-type-ball.png")

result = await framer.agent.applyChanges(
    'SET bN4Wnq0cg $control__motion.mode="wave";',
    { pagePath: "/" }
)
console.log("wave set", JSON.stringify(result).slice(0, 800))
await shot("glass-type-wave.png")

result = await framer.agent.applyChanges(
    'SET bN4Wnq0cg $control__motion.mode="cycle";',
    { pagePath: "/" }
)
console.log("cycle set", JSON.stringify(result).slice(0, 800))

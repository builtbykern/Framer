const fs = require("fs")
const inst = await framer.agent.serialize(
    { id: "aEKcXsOQW", depth: 0 },
    { pagePath: "/" }
)
console.log(JSON.stringify(inst, null, 2).slice(0, 2800))

const shot = await framer.screenshot("aEKcXsOQW", { format: "png", scale: 1 })
fs.writeFileSync("/Users/noel/Desktop/Framer/.tmp/glass-after-refine.png", shot.data)
console.log("shot", shot.data.length)

const desk = await framer.screenshot("WQLkyLRf1", { format: "png", scale: 1 })
fs.writeFileSync("/Users/noel/Desktop/Framer/.tmp/glass-desk-after-refine.png", desk.data)
console.log("desk", desk.data.length)

try {
    const review = await framer.agent.reviewChanges()
    console.log("review", JSON.stringify(review).slice(0, 2500))
} catch (err) {
    console.log("review_err", String(err).slice(0, 800))
}

const fs = require("fs")
const path = require("path")

const outDir = path.join("/Users/noel/Desktop/Framer", "components/thinking-orbs/out")
fs.mkdirSync(outDir, { recursive: true })

const shot = await framer.screenshot("WQLkyLRf1", { format: "png", scale: 2 })
const file = path.join(outDir, "sotd-desktop-pass3.png")
fs.writeFileSync(file, shot.data)

let review = null
try {
    review = await framer.agent.reviewChanges?.()
} catch (e) {
    review = { error: String(e) }
}

const instance = await framer.agent.serialize({ id: "svR1Y5bH9", depth: 0 }, { pagePath: "/" })
const desktop = await framer.agent.getRect({ id: "WQLkyLRf1" }, { pagePath: "/" })

console.log(
    JSON.stringify(
        {
            file,
            bytes: shot.data.length,
            mime: shot.mimeType,
            desktop,
            instanceRect: instance?.$rect,
            instanceName: instance?.name,
            review,
        },
        null,
        2
    )
)

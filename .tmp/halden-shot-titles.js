const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)
const fs = require("fs")
const path = require("path")
const out = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(out, { recursive: true })

async function shot(id, name) {
    const r = await framer.screenshot(id, { format: "png", scale: 1 })
    const file = path.join(out, name)
    fs.writeFileSync(file, r.data)
    return { id, name, bytes: r.data.length, mime: r.mimeType }
}

const results = []
for (const [id, name] of [
    ["BjqrvIntT", "tablet-home.png"],
    ["gSGwySyKV", "work-card.png"],
    ["GAokM9PPJ", "title-node.png"],
    ["rtJNTCNFr", "work-page.png"],
]) {
    try {
        results.push(await shot(id, name))
    } catch (e) {
        results.push({ id, name, error: String(e) })
    }
}

const list = await framer.agent.serializeNodes(
    { ids: ["H9TnltXVB"], depth: 1 },
    { pagePath: "/" }
)

console.log(
    JSON.stringify(
        {
            results,
            listAttrs: list?.[0]?.attributes,
        },
        null,
        2
    )
)

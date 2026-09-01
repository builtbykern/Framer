const fs = require("fs")
const path = require("path")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const plane = await framer.agent.serializeNodes(
    { ids: ["RV7bjlgdh", "BjqrvIntTRV7bjlgdh", "nyI5jW7lARV7bjlgdh"], depth: 0 },
    { pagePath: "/" }
)
const workStill = await framer.agent.serializeNodes(
    { ids: ["afUswAq7g"], depth: 0 },
    { pagePath: "/work/:Work" }
)

function controls(n) {
    const a = n?.attributes || {}
    const out = {}
    for (const [k, v] of Object.entries(a)) {
        if (k.startsWith("$control__") || k === "height" || k === "width") out[k] = v
    }
    return { id: n?.id, name: n?.name, component: n?.component, ...out }
}

const outDir = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(outDir, { recursive: true })
const shots = []
for (const [id, name] of [
    ["BjqrvIntT", "tablet-home-after.png"],
    ["rtJNTCNFr", "work-page-after.png"],
]) {
    try {
        const r = await framer.screenshot(id, { format: "png", scale: 1 })
        fs.writeFileSync(path.join(outDir, name), r.data)
        shots.push({ id, name, bytes: r.data.length })
    } catch (e) {
        shots.push({ id, name, error: String(e) })
    }
}

console.log(
    JSON.stringify(
        {
            project: info.name,
            plane: plane.map(controls),
            workStill: workStill.map(controls),
            shots,
        },
        null,
        2
    )
)

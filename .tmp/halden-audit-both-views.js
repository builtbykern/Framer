const fs = require("fs")
const path = require("path")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const out = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(out, { recursive: true })

const files = await framer.getCodeFiles()
const drift = files.find((f) => f.name === "Drift_Plane.tsx")
const content = String(drift?.content || "")

const nodes = await framer.agent.serializeNodes(
    { ids: ["RV7bjlgdh", "BjqrvIntTRV7bjlgdh", "nyI5jW7lARV7bjlgdh"], depth: 0 },
    { pagePath: "/" }
)

function pick(n) {
    if (!n) return null
    const a = n.attributes || {}
    const keys = Object.keys(a).filter(
        (k) =>
            k.startsWith("$control__") ||
            k === "height" ||
            k === "width" ||
            k === "padding" ||
            k === "top" ||
            k === "bottom"
    )
    const slim = {}
    for (const k of keys) slim[k] = a[k]
    return { id: n.id, name: n.name, slim }
}

const shots = {}
for (const [id, file] of [
    ["WQLkyLRf1", "desktop-drift.png"],
    ["BjqrvIntT", "tablet-collection.png"],
    ["nyI5jW7lA", "phone-collection.png"],
]) {
    try {
        const r = await framer.screenshot(id, { format: "png", scale: 1 })
        fs.writeFileSync(path.join(out, file), r.data)
        shots[file] = r.data.length
    } catch (e) {
        shots[file] = String(e)
    }
}

console.log(
    JSON.stringify(
        {
            project: info.name,
            fileCount: files.length,
            hasFont: content.includes("ControlType.Font"),
            hasNudge: content.includes("collectionNudge") || content.includes("nudge"),
            hasPadTop: content.includes("padTop"),
            instances: nodes.map(pick),
            shots,
        },
        null,
        2
    )
)

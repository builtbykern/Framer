const fs = require("fs")
const path = require("path")

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const typeNode = await framer.agent.getNode(
    { id: "FddpNYFNF" },
    { pagePath: "/" }
)
const a = typeNode?.attributes || {}
const typeInfo = {
    id: typeNode?.id,
    name: a.name || typeNode?.name,
    height: a.height,
    width: a.width,
    overflow: a.overflow,
    visible: a.visible,
    lineClamp: a.lineClamp,
    maxLines: a.maxLines,
    text:
        typeof a.text === "string"
            ? a.text.slice(0, 220)
            : a.text && typeof a.text === "object"
              ? JSON.stringify(a.text).slice(0, 220)
              : a.text,
}

const out = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(out, { recursive: true })
const shots = {}
for (const [id, name] of [
    ["BjqrvIntTRV7bjlgdh", "tablet-plane-sotd.jpg"],
    ["nyI5jW7lARV7bjlgdh", "phone-plane-sotd.jpg"],
    ["BjqrvIntT", "tablet-home-bust.jpg"],
]) {
    try {
        const r = await framer.screenshot(id, { format: "jpeg", scale: 2 })
        fs.writeFileSync(path.join(out, name), r.data)
        shots[name] = r.data.length
    } catch (e) {
        shots[name] = String(e)
    }
}

console.log(JSON.stringify({ project: info.name, typeInfo, shots }, null, 2))

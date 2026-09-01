const fs = require("fs")
const path = require("path")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const out = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(out, { recursive: true })
const shots = {}
for (const [id, name] of [
    ["RV7bjlgdh", "desktop-plane.png"],
    ["BjqrvIntTRV7bjlgdh", "tablet-plane.png"],
    ["nyI5jW7lARV7bjlgdh", "phone-plane.png"],
    ["gSGwySyKV", "work-card.png"],
]) {
    try {
        const r = await framer.screenshot(id, { format: "png", scale: 1 })
        fs.writeFileSync(path.join(out, name), r.data)
        shots[name] = r.data.length
    } catch (e) {
        shots[name] = String(e)
    }
}
console.log(JSON.stringify({ project: info.name, shots }))

const fs = require("fs")
const path = require("path")
const out = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
fs.mkdirSync(out, { recursive: true })
const shots = {}
for (const [id, name] of [
    ["BjqrvIntTRV7bjlgdh", "tablet-plane.png"],
    ["nyI5jW7lARV7bjlgdh", "phone-plane.png"],
    ["BjqrvIntT", "tablet-page2.png"],
    ["nyI5jW7lA", "phone-page2.png"],
]) {
    try {
        const r = await framer.screenshot(id, { format: "png", scale: 1 })
        fs.writeFileSync(path.join(out, name), r.data)
        shots[name] = r.data.length
    } catch (e) {
        shots[name] = String(e)
    }
}
console.log(JSON.stringify({ project: info.name, shots }, null, 2))

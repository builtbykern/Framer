const fs = require("fs")
const path = require("path")
const out = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const drift = await framer.getCodeFile("Drift_Plane.tsx")
const c = String(drift?.content || "")
fs.mkdirSync(out, { recursive: true })
const shots = {}
for (const [id, name] of [
    ["BjqrvIntTRV7bjlgdh", "t-stretch.jpg"],
    ["nyI5jW7lARV7bjlgdh", "p-stretch.jpg"],
]) {
    try {
        const r = await framer.screenshot(id, { format: "jpeg", scale: 2 })
        fs.writeFileSync(path.join(out, name), r.data)
        shots[name] = r.data.length
    } catch (e) {
        shots[name] = String(e)
    }
}
console.log(
    JSON.stringify({
        project: info.name,
        stretch: c.includes("align-content: stretch !important"),
        fill: c.includes("flex: 1 1 0"),
        shots,
    })
)

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
    ["BjqrvIntT", "tablet-fill.jpg"],
    ["nyI5jW7lA", "phone-fill.jpg"],
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
        noCullLoop: !c.includes("PRINT_SCALE"),
        still2fill: c.includes("flex: 1 1 0"),
        shots,
    })
)

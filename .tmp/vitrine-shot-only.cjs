const fs = require("fs")
const dir = "/Users/noel/Desktop/Framer/.tmp/vitrine-shots"

const info = await framer.getProjectInfo()
if (info.name !== "Fair Platform") throw new Error(info.name)

const shots = {}
for (const [id, name] of [
    ["WQLkyLRf1", "home-desktop.jpg"],
    ["t62LHpSTa", "home-tablet.jpg"],
    ["u75vHQkAR", "home-phone.jpg"],
    ["dKIZmzj_1", "piece-desktop.jpg"],
]) {
    const r = await framer.screenshot(id, { format: "jpeg", scale: 1 })
    fs.writeFileSync(`${dir}/${name}`, r.data)
    shots[name] = r.data.length
}

console.log(JSON.stringify(shots))

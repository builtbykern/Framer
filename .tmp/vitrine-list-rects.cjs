const info = await framer.getProjectInfo()
if (info.name !== "Fair Platform") throw new Error(info.name)

const rects = {}
for (const id of [
    "WQLkyLRf1",
    "yAd2lMDSW",
    "t62LHpSTa",
    "t62LHpSTayAd2lMDSW",
    "u75vHQkAR",
    "u75vHQkARyAd2lMDSW",
    "O2btPltNw",
    "t62LHpSTaO2btPltNw",
    "u75vHQkARO2btPltNw",
]) {
    try {
        rects[id] = await framer.agent.getRect({ id }, { pagePath: "/" })
    } catch (e) {
        rects[id] = String(e)
    }
}

const fs = require("fs")
const dir = "/Users/noel/Desktop/Framer/.tmp/vitrine-shots"
for (const [id, name] of [
    ["yAd2lMDSW", "list-desktop.jpg"],
    ["t62LHpSTayAd2lMDSW", "list-tablet.jpg"],
    ["u75vHQkARyAd2lMDSW", "list-phone.jpg"],
]) {
    const r = await framer.screenshot(id, { format: "jpeg", scale: 1 })
    fs.writeFileSync(`${dir}/${name}`, r.data)
}

console.log(JSON.stringify(rects, null, 2))

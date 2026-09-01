const fs = require("fs")
const path = require("path")
const dir = "/Users/noel/Desktop/Framer/.tmp/quarto-shots"
fs.mkdirSync(dir, { recursive: true })

const controls = await framer.agent.readComponentControls({
    componentIds: ["OdvHkNWXz"],
})

const list = await framer.agent.serializeNodes({
    ids: [
        "yAd2lMDSW",
        "t62LHpSTayAd2lMDSW",
        "u75vHQkARyAd2lMDSW",
        "OdvHkNWXz",
        "O2btPltNw",
        "augiA20Il",
    ],
    depth: 1,
    attributeFilter: [
        "name",
        "stackDirection",
        "stackWrap",
        "width",
        "layoutTemplate",
        "collectionList",
    ],
})

for (const [id, name] of [
    ["WQLkyLRf1", "home-desktop.jpg"],
    ["t62LHpSTa", "home-tablet.jpg"],
    ["u75vHQkAR", "home-phone.jpg"],
    ["tVu2ncruf", "info-desktop.jpg"],
    ["J1kd1wjJe", "contact-desktop.jpg"],
]) {
    const r = await framer.screenshot(id, { format: "jpeg", scale: 1 })
    fs.writeFileSync(path.join(dir, name), r.data)
}

const vekter = await framer.agent.readProject(
    [
        { type: "screenshot", id: "WQLkyLRf1" },
        { type: "screenshot", id: "t62LHpSTa" },
        { type: "screenshot", id: "u75vHQkAR" },
    ],
    { pagePath: "/" }
)

console.log(JSON.stringify({ controls, list, vekter }, null, 2))

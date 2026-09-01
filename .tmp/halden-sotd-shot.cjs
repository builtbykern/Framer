const fs = require("fs")
const path = require("path")
const dir = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(dir, { recursive: true })

const planes = await framer.agent.serializeNodes({
    ids: ["RV7bjlgdh", "xmBenkfAk", "dvcc6fymP"],
    depth: 1,
    attributeFilter: [
        "$control__workList",
        "collectionList",
        "fill",
        "link",
        "left",
        "width",
    ],
})

const shots = {}
for (const [id, name] of [
    ["WQLkyLRf1", "sotd-restored-desktop.jpg"],
    ["BjqrvIntT", "sotd-restored-tablet.jpg"],
    ["nyI5jW7lA", "sotd-restored-phone.jpg"],
    ["xmBenkfAk", "sotd-restored-slot.jpg"],
]) {
    const r = await framer.screenshot(id, { format: "jpeg", scale: 1 })
    fs.writeFileSync(path.join(dir, name), r.data)
    shots[name] = r.data.length
}

console.log(JSON.stringify({ planes, shots }, null, 2).slice(0, 8000))

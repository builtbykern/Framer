const fs = require("fs")
const dir = "/Users/noel/Desktop/Framer/.tmp"
const card = await framer.screenshot("v3TEndmfH", { format: "png", scale: 1 })
const desk = await framer.screenshot("WQLkyLRf1", { format: "png", scale: 1 })
fs.writeFileSync(`${dir}/social-track-glass-card.png`, card.data)
fs.writeFileSync(`${dir}/social-track-glass-desk.png`, desk.data)
console.log("card", card.data.length, "desk", desk.data.length)

const files = await framer.getCodeFiles()
const f = files.find((x) => x.name === "BuiltByKern_GlassType.tsx")
console.log(
    "export",
    f &&
        f.exports.map((e) => ({
            name: e.name,
            componentId: e.componentId,
            insertURL: e.insertURL,
        }))
)

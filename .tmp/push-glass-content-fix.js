const fs = require("fs")
const code = fs.readFileSync(
    "/Users/noel/Desktop/Framer/state/BuiltByKern_GlassType.tsx",
    "utf8"
)
const files = await framer.getCodeFiles()
const file = files.find((f) => f.name === "BuiltByKern_GlassType.tsx")
if (!file) throw new Error("missing")
const updated = await file.setFileContent(code)
const errors = await updated.typecheck()
console.log("typecheck", JSON.stringify(errors).slice(0, 2000))

const inst = await framer.agent.serialize(
    { id: "fY_xKpZ99", depth: 0 },
    { pagePath: "/" }
)
console.log(JSON.stringify(inst.attributes?.["$control__content"], null, 2).slice(0, 2000))

const shot = await framer.screenshot("fY_xKpZ99", { format: "png", scale: 1 })
fs.writeFileSync("/Users/noel/Desktop/Framer/.tmp/glass-content.png", shot.data)
console.log("shot", shot.data.length)

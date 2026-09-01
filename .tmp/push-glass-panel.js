const fs = require("fs")
const code = fs.readFileSync(
    "/Users/noel/Desktop/Framer/state/BuiltByKern_GlassType.tsx",
    "utf8"
)
const files = await framer.getCodeFiles()
const file = files.find((f) => f.name === "BuiltByKern_GlassType.tsx")
if (!file) throw new Error("missing BuiltByKern_GlassType.tsx")
const updated = await file.setFileContent(code)
const errors = await updated.typecheck()
console.log("typecheck", JSON.stringify(errors).slice(0, 2500))

const inst = await framer.agent.serialize(
    { id: "aEKcXsOQW", depth: 0 },
    { pagePath: "/" }
)
console.log("keys", Object.keys(inst.attributes || {}).join(","))

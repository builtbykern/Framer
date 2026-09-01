const fs = require("fs")
const code = fs.readFileSync(
    "/Users/noel/Desktop/Framer/state/BuiltByKern_GlassType.tsx",
    "utf8"
)
const files = await framer.getCodeFiles()
const file = files.find((f) => f.name === "BuiltByKern_GlassType.tsx")
if (!file) throw new Error("missing file")
const updated = await file.setFileContent(code)
const errors = await updated.typecheck()
console.log("typecheck", JSON.stringify(errors).slice(0, 1500))

const canvas = await framer.agent.applyChanges(
    [
        "DEL vtGuOmqMv;",
        'SET WQLkyLRf1 fill="white" padding="0px" gap="0px";',
    ].join("\n"),
    { pagePath: "/" }
)
console.log("canvas", JSON.stringify(canvas).slice(0, 1500))

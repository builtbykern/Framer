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

const canvas = await framer.agent.applyChanges(
    [
        "DEL aEKcXsOQW;",
        '+ComponentInstanceNode glassCard component="codeFile/c1HYdAH:default" parent="WQLkyLRf1";',
        'SET glassCard width="960px" height="444px" left="120px" top="278px" name="Glass Type";',
    ].join("\n"),
    { pagePath: "/" }
)
console.log("canvas", JSON.stringify(canvas).slice(0, 1500))

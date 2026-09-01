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
if (errors && errors.length) throw new Error("typecheck")

const canvas = await framer.agent.applyChanges(
    [
        "DEL fY_xKpZ99;",
        '+ComponentInstanceNode glassCard component="codeFile/c1HYdAH:default" parent="WQLkyLRf1";',
        'SET glassCard width="960px" height="444px" left="120px" top="278px" name="Glass Type";',
    ].join("\n"),
    { pagePath: "/" }
)
console.log("canvas", JSON.stringify(canvas).slice(0, 800))
const id = canvas.renamedIds?.glassCard
const inst = await framer.agent.serialize({ id, depth: 0 }, { pagePath: "/" })
const content = inst.attributes?.["$control__content"]
console.log("content", String(content).slice(0, 1800))
console.log("preview", inst.attributes?.["$control__preview"] ? "STILL_THERE" : "gone")
const shot = await framer.screenshot(id, { format: "png", scale: 1 })
fs.writeFileSync("/Users/noel/Desktop/Framer/.tmp/glass-kern-voice.png", shot.data)
console.log("shot", shot.data.length, "id", id)

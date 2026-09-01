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
console.log("typecheck", JSON.stringify(errors).slice(0, 1500))
if (errors && errors.length) throw new Error("typecheck")

const desk = await framer.agent.serialize(
    { id: "WQLkyLRf1", depth: 1 },
    { pagePath: "/" }
)
const kids = desk.children || desk.nodes || []
const list = Array.isArray(desk) ? desk : kids
const found = JSON.stringify(desk).match(/"id":"([^"]+)","name":"Glass Type"/)
const oldId = found ? found[1] : "ESouElwRv"
console.log("old", oldId)

const canvas = await framer.agent.applyChanges(
    [
        `DEL ${oldId};`,
        '+ComponentInstanceNode glassCard component="codeFile/c1HYdAH:default" parent="WQLkyLRf1";',
        'SET glassCard width="960px" height="444px" left="120px" top="278px" name="Glass Type";',
    ].join("\n"),
    { pagePath: "/" }
)
console.log("canvas", JSON.stringify(canvas).slice(0, 600))
const id = canvas.renamedIds?.glassCard
const inst = await framer.agent.serialize({ id, depth: 0 }, { pagePath: "/" })
console.log("look", String(inst.attributes?.["$control__look"]).slice(0, 400))
console.log("motion", String(inst.attributes?.["$control__motion"]).slice(0, 400))
const shot = await framer.screenshot(id, { format: "png", scale: 1 })
fs.writeFileSync("/Users/noel/Desktop/Framer/.tmp/glass-kern-image.png", shot.data)
console.log("shot", shot.data.length, "id", id)

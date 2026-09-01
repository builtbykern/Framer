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

const home = await framer.agent.applyChanges(
    [
        "DEL loms0J3sC;",
        '+ComponentInstanceNode glassHome component="codeFile/c1HYdAH:default" parent="J6H0w3tE9" index="1";',
        'SET glassHome name="Glass Type" width="960px" height="444px";',
    ].join("\n"),
    { pagePath: "/" }
)
const thumb = await framer.agent.applyChanges(
    [
        "DEL LRfZQj7NL;",
        '+ComponentInstanceNode glassThumb component="codeFile/c1HYdAH:default" parent="MKhInCtAf" index="1";',
        'SET glassThumb name="Glass Type" width="960px" height="444px";',
    ].join("\n"),
    { pagePath: "/thumbnail" }
)
const homeId = home.renamedIds?.glassHome
const h = await framer.agent.serialize(
    { id: homeId, depth: 0 },
    { pagePath: "/" }
)
console.log(
    "content",
    String(h.attributes?.["$control__content"] ?? "").slice(0, 500)
)
const shot = await framer.screenshot("WQLkyLRf1", { format: "png", scale: 1 })
fs.writeFileSync(
    "/Users/noel/Desktop/Framer/docs/projects/listings/Kern_GlassType_home.png",
    shot.data
)
console.log("ok", homeId, thumb.renamedIds?.glassThumb, shot.data.length)

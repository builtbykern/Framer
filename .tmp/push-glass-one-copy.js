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
        "DEL TymOeQqEs;",
        '+ComponentInstanceNode glassHome component="codeFile/c1HYdAH:default" parent="J6H0w3tE9" index="1";',
        'SET glassHome name="Glass Type" width="960px" height="444px";',
    ].join("\n"),
    { pagePath: "/" }
)
console.log("home", JSON.stringify(home).slice(0, 500))

const thumb = await framer.agent.applyChanges(
    [
        "DEL dT5f2Oq6P;",
        '+ComponentInstanceNode glassThumb component="codeFile/c1HYdAH:default" parent="MKhInCtAf" index="1";',
        'SET glassThumb name="Glass Type" width="960px" height="444px";',
    ].join("\n"),
    { pagePath: "/thumbnail" }
)
console.log("thumb", JSON.stringify(thumb).slice(0, 500))

const homeId = home.renamedIds?.glassHome
const thumbId = thumb.renamedIds?.glassThumb
const h = await framer.agent.serialize({ id: homeId, depth: 0 }, { pagePath: "/" })
console.log("content", String(h.attributes?.["$control__content"]).slice(0, 900))

const shot = await framer.screenshot("WQLkyLRf1", { format: "png", scale: 1 })
fs.writeFileSync(
    "/Users/noel/Desktop/Framer/docs/projects/listings/Kern_GlassType_home.png",
    shot.data
)
console.log("shot", shot.data.length, homeId, thumbId)

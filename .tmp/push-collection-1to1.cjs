const fs = require("fs")
const path = require("path")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const drift = await framer.getCodeFile("Drift_Plane.tsx")
const src = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Drift_Plane.tsx",
    "utf8"
)
if (!src.includes("function sizeCollectionCover")) {
    throw new Error("missing sizeCollectionCover")
}
if (!src.includes("box.w > 8 ? box.w : parent.w")) {
    throw new Error("measure still maxes parent")
}
if (!src.includes('overflowX: freezeAll ? "hidden"')) {
    throw new Error("freeze overflow not clipped")
}
if (!src.includes('COLLECTION_VEIL_BLUR = "blur(4px)"')) {
    throw new Error("enter veil was retuned — abort")
}
const file = await drift.setFileContent(src)
const typeErrors = await file.typecheck({ strict: true })
const applied = await framer.agent.applyChanges(
    [
        'SET RV7bjlgdh $control__view="drift" $control__workList.0="H9TnltXVB";',
        'SET BjqrvIntTRV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB";',
        'SET nyI5jW7lARV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB";',
        'SET nt9Gs3MMs aspectRatio="3/2";',
    ].join(" "),
    { pagePath: "/" }
)
const out = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(out, { recursive: true })
const shots = {}
for (const [id, name] of [
    ["BjqrvIntT", "t-1to1.jpg"],
    ["nyI5jW7lA", "p-1to1.jpg"],
]) {
    const r = await framer.screenshot(id, { format: "jpeg", scale: 2 })
    fs.writeFileSync(path.join(out, name), r.data)
    shots[name] = r.data.length
}
console.log(JSON.stringify({ project: info.name, typeErrors, applied, shots }))

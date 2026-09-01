const fs = require("fs")
const path = require("path")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const files = await framer.getCodeFiles()
if (!files?.length) throw new Error("no code files")

const src = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Drift_Plane.tsx",
    "utf8"
)
if (!src.includes('COLLECTION_VEIL_BLUR = "blur(4px)"')) {
    throw new Error("enter veil was retuned — abort")
}
if (!src.includes("max-height: var(--still-max")) {
    throw new Error("still height control still dead")
}
if (!src.includes("100cqw")) throw new Error("missing cqw widths")

const drift = await framer.getCodeFile("Drift_Plane.tsx")
const file = await drift.setFileContent(src)

const out = { typeErrors: {} }
out.typeErrors["Drift_Plane.tsx"] = await file.typecheck({ strict: true })
const stills = await framer.getCodeFile("Series_Stills.tsx")
out.typeErrors["Series_Stills.tsx"] = await stills.typecheck({ strict: true })

out.applied = await framer.agent.applyChanges(
    [
        'SET RV7bjlgdh $control__view="drift" $control__workList.0="H9TnltXVB";',
        'SET BjqrvIntTRV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB";',
        'SET nyI5jW7lARV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB";',
    ].join(" "),
    { pagePath: "/" }
)

const dir = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(dir, { recursive: true })
out.shots = {}
for (const [id, name] of [
    ["BjqrvIntT", "fix-tablet.png"],
    ["nyI5jW7lA", "fix-phone.png"],
]) {
    const r = await framer.screenshot(id, { format: "png", scale: 1 })
    fs.writeFileSync(path.join(dir, name), r.data)
    out.shots[name] = r.data.length
}

console.log(JSON.stringify(out, null, 2))

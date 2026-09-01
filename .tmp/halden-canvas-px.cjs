const fs = require("fs")
const path = require("path")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const src = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Drift_Plane.tsx",
    "utf8"
)
if (!src.includes('COLLECTION_VEIL_BLUR = "blur(4px)"')) {
    throw new Error("enter veil was retuned — abort")
}
if (!src.includes("applyCollectionModuleSize")) {
    throw new Error("pixel module sizing missing")
}

const drift = await framer.getCodeFile("Drift_Plane.tsx")
const file = await drift.setFileContent(src)
const out = { typeErrors: await file.typecheck({ strict: true }) }

out.applied = await framer.agent.applyChanges(
    [
        'SET RV7bjlgdh $control__view="drift" $control__workList.0="H9TnltXVB";',
        'SET BjqrvIntTRV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB" height="100%";',
        'SET nyI5jW7lARV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB" height="100%";',
    ].join(" "),
    { pagePath: "/" }
)

const dir = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(dir, { recursive: true })
out.shots = {}
for (const [id, name] of [
    ["nyI5jW7lA", "canvas-px-phone.png"],
    ["BjqrvIntT", "canvas-px-tablet.png"],
]) {
    const r = await framer.screenshot(id, { format: "png", scale: 1 })
    fs.writeFileSync(path.join(dir, name), r.data)
    out.shots[name] = r.data.length
}

try {
    out.readProject = await framer.agent.readProject(
        [
            { type: "screenshot", id: "nyI5jW7lA" },
            { type: "screenshot", id: "BjqrvIntT" },
        ],
        { pagePath: "/" }
    )
} catch (e) {
    out.readProject = String(e)
}

console.log(JSON.stringify(out, null, 2))

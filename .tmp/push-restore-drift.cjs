const fs = require("fs")
const path = require("path")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const files = await framer.getCodeFiles()
const already = files.find((f) => f.name === "Drift_Plane.tsx")
if (!already) throw new Error("missing Drift_Plane")
const code = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Drift_Plane.tsx",
    "utf8"
)
if (!code.includes('data-driftplane-mode="drift"')) {
    throw new Error("drift root missing mode")
}
if (!code.includes(":not([data-driftplane-mode=\"collection\"]) [data-driftplane-cms] [data-framer-name=\"Work Card\"] [data-framer-name=\"Cover\"]")) {
    throw new Error("Cover fill selector broken")
}
if (!code.includes("playIntro = !freezeAll && !prefersReduced && appearOn")) {
    throw new Error("appear gate missing")
}
if (!code.includes("POWER4_INOUT")) {
    throw new Error("power4 missing")
}
const file = await already.setFileContent(code)
const typeErrors = await file.typecheck({ strict: true })
const applied = await framer.agent.applyChanges(
    [
        'MOVE nt9Gs3MMs parent="gSGwySyKV" index="0";',
        'SET gSGwySyKV gap="0px";',
        'SET RV7bjlgdh $control__view="drift" $control__workList.0="H9TnltXVB";',
        'SET BjqrvIntTRV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB";',
        'SET nyI5jW7lARV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB";',
    ].join(" "),
    { pagePath: "/" }
)
const out = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(out, { recursive: true })
const r = await framer.screenshot("WQLkyLRf1", { format: "jpeg", scale: 2 })
fs.writeFileSync(path.join(out, "desktop-drift-restored.jpg"), r.data)
const card = await framer.agent.serialize(
    { id: "gSGwySyKV", depth: 1, attributeFilter: ["name", "gap"] },
    { pagePath: "/" }
)
console.log(
    JSON.stringify({
        id: file.id,
        typeErrors,
        applied,
        bytes: r.data.length,
        cardKids: (card.children || []).map((c) => c.name),
        cardGap: card.attributes?.gap,
    })
)

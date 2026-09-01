const fs = require("fs")
const path = require("path")
const dir = "/Users/noel/Desktop/Framer/.tmp/halden-src"
const out = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const stills = await framer.getCodeFile("Series_Stills.tsx")
const drift = await framer.getCodeFile("Drift_Plane.tsx")
if (!stills || !drift) throw new Error("missing files")
const driftSrc = fs.readFileSync(`${dir}/Drift_Plane.tsx`, "utf8")
if (driftSrc.includes('[data-framer-name="Cover"],\n[data-driftplane-mode="collection"] [data-framer-name="Slug"]')) {
    throw new Error("Cover still grouped with display none")
}
if (!driftSrc.includes('aspect-ratio: 3 / 2 !important')) {
    throw new Error("Cover aspect missing")
}
await stills.setFileContent(fs.readFileSync(`${dir}/Series_Stills.tsx`, "utf8"))
await drift.setFileContent(driftSrc)
const stillsTc = await (
    await framer.getCodeFile("Series_Stills.tsx")
).typecheck({ strict: true })
const driftTc = await (
    await framer.getCodeFile("Drift_Plane.tsx")
).typecheck({ strict: true })
await framer.agent.applyChanges(
    [
        'SET BjqrvIntTURKicPmXy height="100vh";',
        'SET RV7bjlgdh $control__view="drift" $control__workList.0="H9TnltXVB";',
        'SET BjqrvIntTRV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB";',
        'SET nyI5jW7lARV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB";',
    ].join(" "),
    { pagePath: "/" }
)
fs.mkdirSync(out, { recursive: true })
const shots = {}
for (const [id, name] of [
    ["BjqrvIntT", "tablet-cover.jpg"],
    ["nyI5jW7lA", "phone-cover.jpg"],
]) {
    const r = await framer.screenshot(id, { format: "jpeg", scale: 2, quality: 85 })
    fs.writeFileSync(path.join(out, name), r.data)
    shots[name] = r.data.length
}
console.log(JSON.stringify({ project: info.name, stillsTc, driftTc, shots }, null, 2))

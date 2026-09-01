const fs = require("fs")
const path = require("path")
const dir = "/Users/noel/Desktop/Framer/.tmp/halden-src"
const out = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)
const stills = await framer.getCodeFile("Series_Stills.tsx")
const drift = await framer.getCodeFile("Drift_Plane.tsx")
if (!stills || !drift) throw new Error("missing code files")
const driftSrc = fs.readFileSync(`${dir}/Drift_Plane.tsx`, "utf8")
if (!driftSrc.includes("stillsBudget")) {
    throw new Error("stillsBudget missing")
}
if (!driftSrc.includes("flex-basis: 0 !important")) {
    throw new Error("still 2 flex-basis missing")
}
if (!driftSrc.includes("setProperty(\"height\", `${maxH}px`")) {
    throw new Error("pixel still height missing")
}
if (driftSrc.includes('overflowY: "visible"')) {
    throw new Error("collection overflowY still visible")
}
if (!driftSrc.includes('overflowY: "hidden"')) {
    throw new Error("collection overflowY not hidden")
}
await stills.setFileContent(fs.readFileSync(`${dir}/Series_Stills.tsx`, "utf8"))
await drift.setFileContent(driftSrc)
const stillsTc = await (
    await framer.getCodeFile("Series_Stills.tsx")
).typecheck({ strict: true })
const driftLive = await framer.getCodeFile("Drift_Plane.tsx")
const driftTc = await driftLive.typecheck({ strict: true })
const keep = await framer.agent.applyChanges(
    [
        'SET RV7bjlgdh $control__view="drift" $control__workList.0="H9TnltXVB";',
        'SET BjqrvIntTRV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB" height="823px";',
        'SET nyI5jW7lARV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB";',
    ].join(" "),
    { pagePath: "/" }
)
fs.mkdirSync(out, { recursive: true })
const shots = {}
for (const [id, name] of [
    ["BjqrvIntT", "tablet-novscroll.png"],
    ["nyI5jW7lA", "phone-novscroll.png"],
]) {
    try {
        const r = await framer.screenshot(id, { format: "png", scale: 1 })
        fs.writeFileSync(path.join(out, name), r.data)
        shots[name] = r.data.length
    } catch (e) {
        shots[name] = String(e)
    }
}
console.log(
    JSON.stringify(
        {
            project: info.name,
            stillsTc,
            driftTc,
            cull: String(driftLive.content).includes("cullOrphanStills"),
            overflowHidden: String(driftLive.content).includes(
                'overflowY: "hidden"'
            ),
            errors: keep.errors,
            shots,
        },
        null,
        2
    )
)

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
if (!driftSrc.includes("coerceGroup")) throw new Error("missing coerceGroup")
if (driftSrc.includes("cullOrphanStills")) throw new Error("cull still present")
if (!driftSrc.includes("function coerceColor")) throw new Error("missing coerceColor")

await stills.setFileContent(fs.readFileSync(`${dir}/Series_Stills.tsx`, "utf8"))
await drift.setFileContent(driftSrc)
const stillsLive = await framer.getCodeFile("Series_Stills.tsx")
const driftLive = await framer.getCodeFile("Drift_Plane.tsx")
const stillsTc = await stillsLive.typecheck({ strict: true })
const driftTc = await driftLive.typecheck({ strict: true })

const applied = await framer.agent.applyChanges(
    [
        'SET RV7bjlgdh $control__view="drift" $control__workList.0="H9TnltXVB";',
        'SET BjqrvIntTRV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB";',
        'SET nyI5jW7lARV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB";',
    ].join(" "),
    { pagePath: "/" }
)

fs.mkdirSync(out, { recursive: true })
const shots = {}
for (const [id, file] of [
    ["WQLkyLRf1", "audit-desktop.png"],
    ["BjqrvIntT", "audit-tablet.png"],
]) {
    try {
        const r = await framer.screenshot(id, { format: "png", scale: 1 })
        fs.writeFileSync(path.join(out, file), r.data)
        shots[file] = r.data.length
    } catch (e) {
        shots[file] = String(e)
    }
}

console.log(
    JSON.stringify(
        {
            project: info.name,
            stillsTc,
            driftTc,
            unwrap: String(driftLive.content).includes("coerceGroup"),
            cull: String(driftLive.content).includes("cullOrphanStills"),
            errors: applied.errors,
            shots,
        },
        null,
        2
    )
)

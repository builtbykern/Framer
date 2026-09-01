const fs = require("fs")
const path = require("path")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const drift = await framer.getCodeFile("Drift_Plane.tsx")
const stills = await framer.getCodeFile("Series_Stills.tsx")
const driftSrc = drift?.content || ""
const stillsSrc = stills?.content || ""
const out = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(out, { recursive: true })
await framer.agent.applyChanges(
    'SET BjqrvIntTURKicPmXy height="100.5vh";',
    { pagePath: "/" }
)
await framer.agent.applyChanges(
    [
        'SET BjqrvIntTURKicPmXy height="100vh";',
        'SET RV7bjlgdh $control__view="drift" $control__workList.0="H9TnltXVB";',
        'SET BjqrvIntTRV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB";',
        'SET nyI5jW7lARV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB";',
    ].join(" "),
    { pagePath: "/" }
)
const shots = {}
for (const [id, name] of [
    ["WQLkyLRf1", "verify-desktop.jpg"],
    ["BjqrvIntT", "verify-tablet.jpg"],
    ["nyI5jW7lA", "verify-phone.jpg"],
]) {
    const r = await framer.screenshot(id, { format: "jpeg", scale: 2, quality: 80 })
    fs.writeFileSync(path.join(out, name), r.data)
    shots[name] = r.data.length
}
console.log(
    JSON.stringify(
        {
            project: info.name,
            hasFreezeCss: driftSrc.includes("function freezeScatterCss"),
            hasDefaultAspect: driftSrc.includes(
                "[aria-label=\"Series stills\"] > *:nth-child(1) figure"
            ),
            preferPaintFreeze: stillsSrc.includes(
                "preferPaint={inCollection || freeze}"
            ),
            shots,
        },
        null,
        2
    )
)

const fs = require("fs")
const dir = "/Users/noel/Desktop/Framer/.tmp/halden-src"
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)
const drift = await framer.getCodeFile("Drift_Plane.tsx")
if (!drift) throw new Error("missing Drift_Plane")
const src = fs.readFileSync(`${dir}/Drift_Plane.tsx`, "utf8")
if (!src.includes('hidden: (props) => planeViewFromProps(props) !== "collection"')) {
    throw new Error("collection hidden flags missing")
}
await drift.setFileContent(src)
const live = await framer.getCodeFile("Drift_Plane.tsx")
const driftTc = await live.typecheck({ strict: true })
const keep = await framer.agent.applyChanges(
    [
        'SET RV7bjlgdh $control__view="drift" $control__workList.0="H9TnltXVB";',
        'SET BjqrvIntTRV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB";',
        'SET nyI5jW7lARV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB";',
    ].join(" "),
    { pagePath: "/" }
)
const hidden = {
    type: src.includes("title: \"Type\"") &&
        src.includes('hidden: (props) => planeViewFromProps(props) !== "collection"'),
    clickExit: /clickExit:[\s\S]*?hidden: \(\) => true/.test(src),
    stillHeight: /stillHeight:[\s\S]*?hidden: \(\) => true/.test(src),
}
console.log(
    JSON.stringify(
        { project: info.name, driftTc, keepErrors: keep.errors, hidden },
        null,
        2
    )
)

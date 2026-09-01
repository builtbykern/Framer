const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)
const files = await framer.getCodeFiles()
const drift = files.find((f) => f.id === "Og5966a")
const driftTc = await drift.typecheck()
const rebind = await framer.agent.applyChanges(
    [
        'SET RV7bjlgdh $control__view="drift" $control__workList.0="H9TnltXVB";',
        'SET BjqrvIntTRV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB" height="auto";',
        'SET nyI5jW7lARV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB" height="auto";',
    ].join(" "),
    { pagePath: "/" }
)
const shots = await framer.agent.readProject(
    [{ type: "screenshot", id: "BjqrvIntT" }],
    { pagePath: "/" }
)
console.log(
    JSON.stringify(
        {
            project: info.name,
            driftTc,
            errors: rebind.errors,
            tablet: shots.results?.[0]?.image_url,
        },
        null,
        2
    )
)

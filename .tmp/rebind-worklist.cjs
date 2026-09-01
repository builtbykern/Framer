const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const applied = await framer.agent.applyChanges(
    [
        'SET RV7bjlgdh $control__workList.0="H9TnltXVB";',
        'SET BjqrvIntTRV7bjlgdh $control__workList.0="H9TnltXVB";',
        'SET nyI5jW7lARV7bjlgdh $control__workList.0="H9TnltXVB";',
    ].join(" "),
    { pagePath: "/" }
)
const nodes = await framer.agent.serializeNodes(
    {
        ids: ["RV7bjlgdh", "BjqrvIntTRV7bjlgdh", "nyI5jW7lARV7bjlgdh"],
        depth: 0,
        attributeFilter: ["$control__workList", "$control__view", "height"],
    },
    { pagePath: "/" }
)
console.log(JSON.stringify({ applied, nodes }, null, 2))

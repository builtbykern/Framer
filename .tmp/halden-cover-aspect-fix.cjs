const applied = await framer.agent.applyChanges(
    'SET nt9Gs3MMs aspectRatio="1.5"; SET RV7bjlgdh $control__workList.0="H9TnltXVB"; SET BjqrvIntTRV7bjlgdh $control__workList.0="H9TnltXVB"; SET nyI5jW7lARV7bjlgdh $control__workList.0="H9TnltXVB";',
    { pagePath: "/" }
)
const cover = await framer.agent.getNode({ id: "nt9Gs3MMs" }, { pagePath: "/" })
const a = cover.attributes || {}
console.log(JSON.stringify({ applied, aspectRatio: a.aspectRatio, height: a.height, width: a.width }))

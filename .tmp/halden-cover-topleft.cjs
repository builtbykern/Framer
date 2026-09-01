const applied = await framer.agent.applyChanges(
    'SET nt9Gs3MMs top="0px" left="0px"; SET RV7bjlgdh $control__workList.0="H9TnltXVB"; SET BjqrvIntTRV7bjlgdh $control__workList.0="H9TnltXVB"; SET nyI5jW7lARV7bjlgdh $control__workList.0="H9TnltXVB";',
    { pagePath: "/" }
)
const cover = await framer.agent.getNode({ id: "nt9Gs3MMs" }, { pagePath: "/" })
console.log(
    JSON.stringify({
        applied,
        cover: {
            position: cover.attributes.position,
            top: cover.attributes.top,
            left: cover.attributes.left,
            height: cover.attributes.height,
        },
    })
)

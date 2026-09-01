const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const applied = await framer.agent.applyChanges(
    [
        'SET RV7bjlgdh $control__motion.appear=true $control__workList.0="H9TnltXVB";',
        'SET BjqrvIntTRV7bjlgdh $control__motion.appear=true $control__workList.0="H9TnltXVB";',
        'SET nyI5jW7lARV7bjlgdh $control__motion.appear=true $control__padTop="80" $control__workList.0="H9TnltXVB";',
    ].join(" "),
    { pagePath: "/" }
)

const nodes = await framer.agent.serializeNodes(
    { ids: ["RV7bjlgdh", "BjqrvIntTRV7bjlgdh", "nyI5jW7lARV7bjlgdh"], depth: 0 },
    { pagePath: "/" }
)

function motionOf(n) {
    const a = n?.attributes || {}
    return {
        id: n.id,
        motion: a.$control__motion,
        padTop: a.$control__padTop,
        workList: a.$control__workList,
        view: a.$control__view,
    }
}

console.log(
    JSON.stringify(
        {
            project: info.name,
            errors: applied.errors,
            parseErrors: applied.parseErrors,
            nodes: nodes.map(motionOf),
        },
        null,
        2
    )
)

const rebind = await framer.agent.applyChanges(
    [
        'SET RV7bjlgdh $control__view="drift" $control__workList.0="H9TnltXVB";',
        'SET BjqrvIntTRV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB" height="100%";',
        'SET nyI5jW7lARV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB" height="100%";',
        'SET yGFlVus2I $control__cover="var(--variable-KF94WDLfr)";',
    ].join(" "),
    { pagePath: "/" }
)
const info = await framer.getProjectInfo()
console.log(
    JSON.stringify(
        {
            project: info.name,
            errors: rebind.errors,
            warnings: rebind.warnings,
        },
        null,
        2
    )
)

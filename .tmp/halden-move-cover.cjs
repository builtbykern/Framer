const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const applied = await framer.agent.applyChanges(
    [
        'MOVE nt9Gs3MMs parent="gSGwySyKV" index="1";',
        'MOVE XwtyrQVdF parent="YonVwWSco" index="0";',
        'SET YonVwWSco width="100%" gap="6px";',
        'SET gSGwySyKV gap="8px";',
        'SET GAokM9PPJ overflow="visible";',
        'SET FddpNYFNF overflow="visible";',
        'SET RV7bjlgdh $control__view="drift" $control__workList.0="H9TnltXVB";',
        'SET BjqrvIntTRV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB";',
        'SET nyI5jW7lARV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB";',
    ].join(" "),
    { pagePath: "/" }
)
const card = await framer.agent.serialize(
    { id: "gSGwySyKV", depth: 2, attributeFilter: ["name", "gap", "width"] },
    { pagePath: "/" }
)
console.log(JSON.stringify({ project: info.name, applied, card }, null, 2).slice(0, 8000))

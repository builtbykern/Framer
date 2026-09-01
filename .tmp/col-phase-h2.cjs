await framer.agent.readComponentControls({ componentIds: ["PzdF7MhGJ"] })

const attempt = await framer.agent.applyChanges(
    'SET Fyj0MwAfG $control__variant.from="var(--variable-TVImviktM)" $control__variant.transforms.0.name="convertFromOption" $control__variant.transforms.0.outputType="option" $control__variant.transforms.0.cases.0.from="Square" $control__variant.transforms.0.cases.0.to="Square" $control__variant.transforms.0.cases.1.from="Landscape" $control__variant.transforms.0.cases.1.to="Landscape" $control__variant.transforms.0.cases.2.from="Portrait" $control__variant.transforms.0.cases.2.to="Portrait" $control__variant.transforms.0.cases.3.from="Cluster" $control__variant.transforms.0.cases.3.to="aBz9LPj8U" $control__variant.transforms.0.default="Square";',
    { pagePath: "/" }
)

console.log(JSON.stringify({ attempt }, null, 2))

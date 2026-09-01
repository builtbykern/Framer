await framer.agent.readProject(
    [{ type: "implementation-guide-from-index", name: "Computed Values" }],
    { pagePath: "/" }
)
await framer.agent.readComponentControls({ componentIds: ["PzdF7MhGJ"] })

const binds = await framer.agent.applyChanges(
    `
SET Fyj0MwAfG $control__slug="var(--variable-v1_jAZuNB)" $control__variant.from="var(--variable-TVImviktM)" $control__variant.transforms.0.name="convertFromOption" $control__variant.transforms.0.outputType="option" $control__variant.transforms.0.cases.0.from="Square" $control__variant.transforms.0.cases.0.to="Square" $control__variant.transforms.0.cases.1.from="Landscape" $control__variant.transforms.0.cases.1.to="Landscape" $control__variant.transforms.0.cases.2.from="Portrait" $control__variant.transforms.0.cases.2.to="Portrait" $control__variant.transforms.0.cases.3.from="Cluster" $control__variant.transforms.0.cases.3.to="Cluster" $control__variant.transforms.0.default="Square";
SET KnMOObwVE link.href="/work/:Work" link.collectionItem="var(--variable-v1_jAZuNB)";
SET Q6fE1RPzM overflow="auto" height="auto" stackAlignment="start";
SET WQcnJ55Ok visible.from="var(--variable-Q6fE1RPzM-item-count)" visible.transforms.0.name="equals" visible.transforms.0.value="0";
`.replace(/\n+/g, " "),
    { pagePath: "/" }
)

console.log(JSON.stringify({ binds }, null, 2))

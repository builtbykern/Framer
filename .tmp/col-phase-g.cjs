await framer.agent.readComponentControls({ componentIds: ["PzdF7MhGJ"] })

const wrap = await framer.agent.applyChanges(
    `
+FrameNode crdWrap01 parent="Q6fE1RPzM" index="0" name="Work Item" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="start" gap="0px" position="relative" width="auto" height="auto" cursor="pointer" link.href="/work/:Work" link.collectionItem="var(--variable-v1_jAZuNB)";
MOVE Fyj0MwAfG parent="crdWrap01";
SET Q6fE1RPzM collectionList.repeatedDescendantId="crdWrap01" overflow="auto" height="auto" stackAlignment="start";
SET Fyj0MwAfG $control__title="var(--variable-ie3ZK0dAj)" $control__date="var(--variable-Vu5g1RUmz)" $control__description="var(--variable-nVT6VC7MK)" $control__cover="var(--variable-maO5HB9O2)" $control__still="var(--variable-Bj5XtxwsY)" $control__slug="var(--variable-v1_jAZuNB)" $control__variant="var(--variable-TVImviktM)";
SET WQcnJ55Ok visible.from="var(--variable-Q6fE1RPzM-item-count)" visible.transforms.0.name="equals" visible.transforms.0.value="0";
`.replace(/\n+/g, " "),
    { pagePath: "/" }
)

console.log(JSON.stringify({ wrap }, null, 2))

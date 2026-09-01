await framer.agent.readProject(
    [{ type: "implementation-guide-from-index", name: "CMS Collection Lists" }],
    { pagePath: "/" }
)
await framer.agent.readComponentControls({ componentIds: ["OdvHkNWXz"] })

const muted = "var(--token-41c8b9ae-e604-40b6-9d37-a14c3803c179)"

const list = await framer.agent.applyChanges(
    `
+FrameNode lstFeed01 parent="WQLkyLRf1" name="Work List" layout="stack" stackDirection="horizontal" stackDistribution="start" stackAlignment="start" stackWrapEnabled="false" gap="32px" overflow="auto" hideScrollbars="true" padding="40px 24px 64px 40px" position="relative" width="1fr" height="auto";
+FrameNode crdWrap01 parent="lstFeed01" name="Work Item" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="start" gap="0px" position="relative" width="auto" height="auto" cursor="pointer";
SET lstFeed01 collectionList.collection="Work" collectionList.repeatedDescendantId="crdWrap01" collectionList.filtersOperator="and" collectionList.filters.0.variableId="SmVWXPogp" collectionList.filters.0.transforms.0.name="equals" collectionList.filters.0.transforms.0.value="true" collectionList.sorting.0.variable="hpRwQbDYl" collectionList.sorting.0.direction="desc";
SET crdWrap01 link.href="/work/:Work" link.collectionItem="var(--variable-N_XD2ACYK)";
+ComponentInstanceNode instCard01 parent="crdWrap01" component="OdvHkNWXz" name="Work Card" position="relative" width="auto" height="auto";
+FrameNode lstEmpty1 parent="lstFeed01" name="Empty State" layout="stack" stackDirection="vertical" stackDistribution="center" stackAlignment="start" gap="8px" padding="24px" position="relative" width="auto" height="auto" minWidth="280px" visible.from="var(--variable-lstFeed01-item-count)" visible.transforms.0.name="equals" visible.transforms.0.value="0";
+RichTextNode empCopy01 parent="lstEmpty1" name="Empty" text="No featured series." textStylePreset="Body" textColor="${muted}" width="auto" height="auto";
`.replace(/\n+/g, " "),
    { pagePath: "/" }
)

const instId = list.renamedIds?.instCard01 || "instCard01"
const wrapId = list.renamedIds?.crdWrap01 || "crdWrap01"
const feedId = list.renamedIds?.lstFeed01 || "lstFeed01"
const emptyId = list.renamedIds?.lstEmpty1 || "lstEmpty1"

const binds = await framer.agent.applyChanges(
    `SET ${instId} $control__title="var(--variable-Rjsd6qD9G)" $control__date="var(--variable-hpRwQbDYl)" $control__description="var(--variable-docaG2WpK)" $control__cover="var(--variable-pZepVvnAD)" $control__still="var(--variable-BM_bNm1MI)" $control__variant.from="var(--variable-KdvErZQQ4)" $control__variant.transforms.0.name="convertFromOption" $control__variant.transforms.0.outputType="option" $control__variant.transforms.0.cases.0.from="Square" $control__variant.transforms.0.cases.0.to="Square" $control__variant.transforms.0.cases.1.from="Landscape" $control__variant.transforms.0.cases.1.to="Landscape" $control__variant.transforms.0.cases.2.from="Portrait" $control__variant.transforms.0.cases.2.to="Portrait" $control__variant.transforms.0.cases.3.from="Cluster" $control__variant.transforms.0.cases.3.to="S4aeyJLQa" $control__variant.transforms.0.default="Square"; SET ${wrapId} link.href="/work/:Work" link.collectionItem="var(--variable-N_XD2ACYK)"; SET ${feedId} overflow="auto"; SET ${emptyId} visible.from="var(--variable-${feedId}-item-count)" visible.transforms.0.name="equals" visible.transforms.0.value="0";`,
    { pagePath: "/" }
)

console.log(JSON.stringify({ list, binds, instId, wrapId, feedId }, null, 2))

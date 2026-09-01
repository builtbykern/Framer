const paper = "var(--token-6f520be6-0d5d-45ee-87ac-81db0390a6f2)"
const muted = "var(--token-57f1af78-355c-46d4-835e-f1a5c3ef2f45)"

await framer.agent.readProject(
    [{ type: "implementation-guide-from-index", name: "CMS Collection Lists" }],
    { pagePath: "/" }
)
await framer.agent.readComponentControls({ componentIds: ["PzdF7MhGJ"] })

const fixes = await framer.agent.applyChanges(
    `
SET qtc8B8PFy width="1fr" height="1fr";
SET vN8iVl4NW height="900px";
SET GtJY_uolR width="560px";
SET HhWbke9rc width="560px";
SET y2PAJKpgC width="560px";
SET nJ9U1XJB_ height="560px" width="1fr";
SET plPhECUuj height="360px" width="1fr";
SET HUNupzO9a overflow="visible";
SET hh6O1ngaE height="800px";
SET tXhqCKMP_ initialValue="2025-03-14T00:00:00.000Z";
SET WQLkyLRf1 width="1fr" height="1fr";
+FrameNode lstFeed01 parent="WQLkyLRf1" name="Work List" layout="stack" stackDirection="horizontal" stackDistribution="start" stackAlignment="end" stackWrapEnabled="false" gap="32px" overflowX="auto" overflowY="hidden" hideScrollbars="true" padding="40px 24px 64px 40px" position="relative" width="1fr" height="1fr";
+ComponentInstanceNode instCard01 parent="lstFeed01" component="PzdF7MhGJ" name="Work Card" position="relative" width="auto" height="auto" $control__title="var(--variable-ie3ZK0dAj)" $control__date="var(--variable-Vu5g1RUmz)" $control__description="var(--variable-nVT6VC7MK)" $control__cover="var(--variable-maO5HB9O2)" $control__still="var(--variable-Bj5XtxwsY)" $control__slug="var(--variable-v1_jAZuNB)" $control__variant="var(--variable-TVImviktM)" link.href="/work/:Work" link.collectionItem="var(--variable-v1_jAZuNB)";
+FrameNode lstEmpty1 parent="lstFeed01" name="Empty State" layout="stack" stackDirection="vertical" stackDistribution="center" stackAlignment="start" gap="8px" padding="24px" position="relative" width="auto" height="auto" minWidth="280px" visible.from="var(--variable-lstFeed01-item-count)" visible.transforms.0.name="equals" visible.transforms.0.value="0";
+RichTextNode empCopy01 parent="lstEmpty1" name="Empty" text="No featured series." textStylePreset="Body" textColor="${muted}" width="auto" height="auto";
SET lstFeed01 collectionList.collection="Work" collectionList.repeatedDescendantId="instCard01" collectionList.filtersOperator="and" collectionList.filters.0.variableId="mK65wkkj0" collectionList.filters.0.transforms.0.name="equals" collectionList.filters.0.transforms.0.value="true" collectionList.sorting.0.variable="Vu5g1RUmz" collectionList.sorting.0.direction="desc";
`.replace(/\n+/g, " "),
    { pagePath: "/" }
)

console.log(JSON.stringify({ fixes }, null, 2))

await framer.agent.readProject(
    [{ type: "implementation-guide-from-index", name: "CMS Collection Lists" }],
    { pagePath: "/" }
)

const created = await framer.agent.applyChanges(
    `
+FrameNode slotWork1 parent="augiA20Il" name="Work" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="start" gap="0px" overflow="clip" left="4000px" top="0px" width="390px" height="auto";
+FrameNode slotCard1 parent="slotWork1" name="Work Card" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="start" gap="0px" position="relative" width="100%" height="auto" cursor="pointer";
+FrameNode slotCover1 parent="slotCard1" name="Cover" overflow="clip" position="relative" width="100%" height="320px";
+FrameNode slotEmpty1 parent="slotWork1" name="Empty State" layout="stack" width="1fr" height="auto" visible="false";
SET slotWork1 collectionList.collection="Work" collectionList.repeatedDescendantId="slotCard1" collectionList.filtersOperator="and" collectionList.filters.0.variableId="LrPrf7_RQ" collectionList.filters.0.transforms.0.name="equals" collectionList.filters.0.transforms.0.value="true" collectionList.sorting.0.variable="KKPJSa2Nk" collectionList.sorting.0.direction="desc";
SET slotCover1 fill="var(--variable-KF94WDLfr)";
SET slotCard1 link.href="/work/:Work" link.collectionItem="var(--variable-Bte5utJ62)";
`.replace(/\n+/g, " "),
    { pagePath: "/" }
)

const listId = created.renamedIds?.slotWork1 || "slotWork1"
const bind = await framer.agent.applyChanges(
    [
        `SET RV7bjlgdh $control__workList.0="${listId}";`,
        `SET BjqrvIntTRV7bjlgdh $control__workList.0="${listId}";`,
        `SET nyI5jW7lARV7bjlgdh $control__workList.0="${listId}";`,
    ].join(" "),
    { pagePath: "/" }
)

console.log(JSON.stringify({ created, listId, bind }, null, 2))

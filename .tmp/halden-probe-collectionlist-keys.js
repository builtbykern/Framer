const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const pagePath = "/work/:Work"
const parent = "MI_ZHE7kH"

const make = await framer.agent.applyChanges(
    `+FrameNode probeList parent="${parent}" name="Gallery Probe" layout="stack" stackDirection="vertical" width="1fr" height="auto"; +FrameNode probeItem parent="probeList" name="Probe Item" width="1fr" height="80px" fill="rgba(0,0,0,0.06)";`,
    { pagePath }
)

const listId = make.renamedIds?.probeList || "probeList"
const itemId = make.renamedIds?.probeItem || "probeItem"

const probes = [
    `SET ${listId} collectionList.collection="Work" collectionList.repeatedDescendantId="${itemId}" collectionList.limit="0";`,
    `SET ${listId} collectionList.field="WTTAaEd5y";`,
    `SET ${listId} collectionList.variable="WTTAaEd5y";`,
    `SET ${listId} collectionList.array="WTTAaEd5y";`,
    `SET ${listId} collectionList.data="var(--variable-WTTAaEd5y)";`,
    `SET ${listId} collectionList.content="var(--variable-WTTAaEd5y)";`,
    `SET ${listId} collectionList.images="var(--variable-WTTAaEd5y)";`,
    `SET ${listId} collectionList.galleryField="WTTAaEd5y";`,
    `SET ${listId} collectionList.repeat="var(--variable-WTTAaEd5y)";`,
    `SET ${listId} collectionList.sourceId="WTTAaEd5y";`,
    `SET ${listId} collectionList.variableId="WTTAaEd5y";`,
]

const results = []
for (const dsl of probes) {
    const r = await framer.agent.applyChanges(dsl, { pagePath })
    const node = await framer.agent.getNode({ id: listId }, { pagePath })
    results.push({
        dsl,
        errors: r.errors,
        message: r.message,
        collectionList: node?.attributes?.collectionList,
    })
}

const cleanup = await framer.agent.applyChanges(`DEL ${listId};`, { pagePath })

console.log(
    JSON.stringify(
        {
            make: { errors: make.errors, renamedIds: make.renamedIds, message: make.message },
            results,
            cleanup: cleanup.errors || cleanup.message,
        },
        null,
        2
    )
)

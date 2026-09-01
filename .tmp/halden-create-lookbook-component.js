const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const dsl = [
    `+ComponentNode lookbookComp name="Lookbook";`,
    `+FrameNode lookbookRoot parent="lookbookComp" name="Lookbook" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="start" gap="28px" width="1fr" height="auto";`,
    `+GalleryVariable lookbookGal name="Gallery" scope="lookbookComp";`,
    `+FrameNode lookbookList parent="lookbookRoot" name="Stills" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="start" gap="28px" width="1fr" height="auto";`,
    `+FrameNode lookbookItem parent="lookbookList" name="Still" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="start" gap="8px" width="1fr" height="auto" htmlTag="figure";`,
    `+FrameNode lookbookImg parent="lookbookItem" name="Image" overflow="clip" position="relative" width="1fr" height="fit-image";`,
    `+RichTextNode lookbookCap parent="lookbookItem" name="Caption" width="1fr" height="auto" htmlTag="figcaption";`,
].join(" ")

const create = await framer.agent.applyChanges(dsl, { pagePath: "/" })

const bindAttempts = []
for (const cmd of [
    `SET lookbookList collectionList.collection="Gallery" collectionList.repeatedDescendantId="lookbookItem";`,
    `SET lookbookList collectionList.collection="lookbookGal" collectionList.repeatedDescendantId="lookbookItem";`,
    `SET lookbookImg fill="var(--variable-lookbookGal)";`,
]) {
    const r = await framer.agent.applyChanges(cmd, { pagePath: "/" })
    bindAttempts.push({
        cmd,
        errors: r.errors,
        message: r.message,
        renamedIds: r.renamedIds,
    })
}

const ids = [
    create.renamedIds?.lookbookComp || "lookbookComp",
    create.renamedIds?.lookbookGal || "lookbookGal",
    create.renamedIds?.lookbookList || "lookbookList",
    create.renamedIds?.lookbookImg || "lookbookImg",
]

const ser = await framer.agent.serializeNodes({ ids, depth: 4 })

console.log(
    JSON.stringify(
        {
            create: {
                errors: create.errors,
                message: create.message,
                renamedIds: create.renamedIds,
                lint: create.linter,
            },
            bindAttempts,
            ser,
        },
        null,
        2
    ).slice(0, 25000)
)

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const applied = await framer.agent.applyChanges(
    [
        '+RichTextNode HaldenCardDesc parent="YonVwWSco" index="1" name="Description" position="relative" width="100%" height="auto" text="var(--variable-blc_46opK)" fontName="Inter" fontWeight="400" fontSize="13px" letterSpacing="0em" lineHeight="1.4em" textAlignment="start" textColor="var(--token-8028b435-146d-4074-967e-823e6635036f)";',
    ].join(" "),
    { pagePath: "/" }
)

const card = await framer.agent.serializeNodes(
    { ids: ["YonVwWSco"], depth: 3 },
    { pagePath: "/" }
)

console.log(
    JSON.stringify(
        {
            project: info.name,
            parseErrors: applied.parseErrors,
            errors: applied.errors,
            warnings: applied.warnings,
            renamedIds: applied.renamedIds,
            meta: card,
        },
        null,
        2
    )
)

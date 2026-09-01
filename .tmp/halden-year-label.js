const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const first = await framer.agent.applyChanges(
    'SET XwtyrQVdF textStylePreset="Label" fontName="IBM Plex Mono";',
    { pagePath: "/" }
)

const year = await framer.agent.getNode({ id: "XwtyrQVdF" }, { pagePath: "/" })
const a = year?.attributes || {}

await framer.agent.applyChanges(
    [
        'SET RV7bjlgdh $control__workList.0="H9TnltXVB";',
        'SET Yptm4PAEu $control__variant="closed" $control__menuOpen="false";',
    ].join("\n"),
    { pagePath: "/" }
)

console.log(
    JSON.stringify(
        {
            project: info.name,
            errors: first?.errors || null,
            fontName: a.fontName,
            preset: a.textStylePreset,
            fontSize: a.fontSize,
        },
        null,
        2
    )
)

const styles = await framer.agent.getNodesOfTypes({
    types: ["ColorStyleTokenNode", "TextStylePresetNode"],
})
const root = await framer.agent.serializeNodes({ ids: ["rootNode"], depth: 0 })
console.log(
    JSON.stringify(
        {
            styles: styles.map((s) => ({
                id: s.id,
                name: s.name,
                type: s.type,
                light: s.light || s.attributes?.light,
                font: s.attributes?.fontName,
                size: s.attributes?.breakpoint?.default?.fontSize,
            })),
            meta: root[0]?.attributes?.metadata,
        },
        null,
        2
    )
)

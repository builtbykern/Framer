const styles = await framer.agent.getNodesOfTypes({
    types: [
        "TextStylePresetNode",
        "LinkStylePresetNode",
        "ColorStyleTokenNode",
        "LayoutTemplateNode",
    ],
})
console.log(JSON.stringify(styles, null, 2).slice(0, 8000))

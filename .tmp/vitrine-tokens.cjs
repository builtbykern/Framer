const info = await framer.getProjectInfo()
if (info.name !== "Fair Platform") throw new Error(info.name)

const tokens = await framer.agent.serializeNodes({
    ids: [
        "14d41f00-d3b3-4455-b994-8566aa84333e",
        "724c8003",
        "41c8b9ae",
        "2c57476b",
    ],
    depth: 0,
})

const styles = await framer.agent.getNodesOfTypes({ types: ["ColorStyleTokenNode", "TextStylePresetNode"] })

const word = await framer.agent.serializeNodes({
    ids: ["QhfNwiny9", "OdvHkNWXz", "WQLkyLRf1", "eGJAoz6x_"],
    depth: 1,
    attributeFilter: ["name", "fontName", "textStylePreset", "fill", "textColor", "light", "dark"],
})

console.log(
    JSON.stringify(
        {
            project: info.name,
            tokenAttempt: tokens.map((t) => ({ id: t.id, name: t.name, type: t.type, a: t.attributes })),
            colors: (styles || [])
                .filter((n) => n.type === "ColorStyleTokenNode" || n.name)
                .slice(0, 20),
            word,
        },
        null,
        2
    )
)

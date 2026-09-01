const node = await framer.getNode("lHV5aHgaZGz9TsJWVA")
if (!node) throw new Error("Close trigger not found")

console.log(
    JSON.stringify(
        {
            constructor: node.constructor?.name,
            keys: Object.keys(node),
            attributes: node.attributes,
            hasSetAttributes: typeof node.setAttributes === "function",
        },
        null,
        2
    )
)

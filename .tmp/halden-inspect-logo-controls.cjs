const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const controls = await framer.agent.readComponentControls({
    componentIds: ["codeFile/sQer058:default"],
})
const instances = await framer.agent.serializeNodes({
    ids: ["VBfODp8Ml", "lHV5aHgaZVBfODp8Ml"],
    depth: 0,
})
const triggers = await framer.agent.serializeNodes({
    ids: ["Gz9TsJWVA", "lHV5aHgaZGz9TsJWVA"],
    depth: 0,
})

console.log(JSON.stringify({ controls, instances, triggers }, null, 2))

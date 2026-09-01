const fs = require("fs")

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const font =
    '{\\"fontSelector\\":\\"FS;IBMPlexSans-semibold\\",\\"fontSize\\":\\"24px\\",\\"letterSpacing\\":[0,\\"em\\"],\\"lineHeight\\":[1,\\"em\\"]}'
const applied = await framer.agent.applyChanges(
    `SET VBfODp8Ml $control__font="${font}";\nSET lHV5aHgaZVBfODp8Ml $control__font="${font}";`
)

const instances = await framer.agent.serializeNodes({
    ids: ["VBfODp8Ml", "lHV5aHgaZVBfODp8Ml"],
    depth: 0,
})
for (const instance of instances) {
    if (
        !String(instance.attributes?.$control__font).includes(
            "IBMPlexSans-semibold"
        )
    ) {
        throw new Error(`Font did not bind on ${instance.id}`)
    }
}

const outputDir = "/Users/noel/Desktop/Framer/.tmp/halden-nav-shots"
fs.mkdirSync(outputDir, { recursive: true })
for (const [id, filename] of [
    ["QZInDjV1k", "closed-ibm-plex.jpg"],
    ["lHV5aHgaZ", "open-ibm-plex.jpg"],
]) {
    const shot = await framer.screenshot(id, { format: "jpeg", scale: 2 })
    fs.writeFileSync(`${outputDir}/${filename}`, shot.data)
}

console.log(JSON.stringify({ ok: true, applied, instances }, null, 2))

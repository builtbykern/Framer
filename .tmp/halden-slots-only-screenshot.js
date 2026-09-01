const fs = require("fs")
const path = require("path")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const pagePath = "/work/:Work"
const outDir = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(outDir, { recursive: true })

const clear = await framer.agent.applyChanges(
    `SET afUswAq7g $control__images=""; SET LSqc1L2WHafUswAq7g $control__images=""; SET Tf2mbU7BvafUswAq7g $control__images="";`,
    { pagePath }
)

const shots = []
for (const [id, name] of [
    ["afUswAq7g", "slots-only-stills.png"],
    ["yn0nMGJJL", "slots-only-gallery.png"],
]) {
    try {
        const r = await framer.screenshot(id, { format: "png", scale: 1 })
        fs.writeFileSync(path.join(outDir, name), r.data)
        shots.push({ id, name, bytes: r.data.length })
    } catch (e) {
        shots.push({ id, name, error: String(e).slice(0, 300) })
    }
}

const restore = await framer.agent.applyChanges(
    [
        `SET afUswAq7g $control__images.from="var(--variable-WTTAaEd5y)" $control__images.transforms.0.name="arrayToArray" $control__images.transforms.0.mapping.image.type="image" $control__images.transforms.0.mapping.image.value="var(--variable-ZkP9UsFFL)";`,
        `SET LSqc1L2WHafUswAq7g $control__images.from="var(--variable-WTTAaEd5y)" $control__images.transforms.0.name="arrayToArray" $control__images.transforms.0.mapping.image.type="image" $control__images.transforms.0.mapping.image.value="var(--variable-ZkP9UsFFL)";`,
        `SET Tf2mbU7BvafUswAq7g $control__images.from="var(--variable-WTTAaEd5y)" $control__images.transforms.0.name="arrayToArray" $control__images.transforms.0.mapping.image.type="image" $control__images.transforms.0.mapping.image.value="var(--variable-ZkP9UsFFL)";`,
    ].join(" "),
    { pagePath }
)

const after = await framer.agent.getNode({ id: "afUswAq7g" }, { pagePath })

console.log(
    JSON.stringify(
        {
            clear: { errors: clear.errors, message: clear.message },
            shots,
            restore: { errors: restore.errors, message: restore.message },
            afterImages: after?.attributes?.$control__images,
            afterStill1: after?.attributes?.$control__still1,
        },
        null,
        2
    )
)

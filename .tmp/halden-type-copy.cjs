const fs = require("fs")
const path = require("path")

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const cols = await framer.getCollections()
const work = cols.find((c) => c.id === "amTC8pcIG" || c.name === "Work")
const items = await work.getItems()
const copy = items.map((it) => {
    const fd = it.fieldData || {}
    const title = fd.lmTMqy_0B
    const type = fd.blc_46opK
    const t =
        typeof title === "string"
            ? title
            : title?.value || JSON.stringify(title)
    const d =
        typeof type === "string" ? type : type?.value || JSON.stringify(type)
    return {
        slug: it.slug,
        title: String(t).slice(0, 80),
        typeChars: String(d).length,
        type: String(d),
    }
})

const applied = await framer.agent.applyChanges(
    'SET nt9Gs3MMs height="321px";',
    { pagePath: "/" }
)

const out = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(out, { recursive: true })
const r = await framer.screenshot("BjqrvIntT", { format: "jpeg", scale: 2 })
fs.writeFileSync(path.join(out, "tablet-type-bust.jpg"), r.data)

const restore = await framer.agent.applyChanges(
    'SET nt9Gs3MMs height="320px";',
    { pagePath: "/" }
)

console.log(
    JSON.stringify(
        {
            project: info.name,
            copy,
            applied,
            restore,
            bytes: r.data.length,
        },
        null,
        2
    )
)

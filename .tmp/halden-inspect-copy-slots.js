const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)
const fs = require("fs")
const path = require("path")

const cols = await framer.getCollections()
const work = cols.find((c) => c.id === "amTC8pcIG" || c.name === "Work")
const fields = await work.getFields()
const typeField = fields.find((f) => f.id === "ZMWV4jFbG")
const titleField = fields.find((f) => f.id === "lmTMqy_0B")
const items = (await work.getItems()).slice(0, 4).map((it) => ({
    slug: it.slug,
    title: it.fieldData.lmTMqy_0B,
    type: it.fieldData.ZMWV4jFbG,
    desc: String(it.fieldData.blc_46opK || "").slice(0, 80),
}))

const meta = await framer.agent.serializeNodes(
    { ids: ["GAokM9PPJ", "FddpNYFNF", "KSgxSNQ22", "YonVwWSco", "yGFlVus2I"], depth: 3 },
    { pagePath: "/" }
)

const out = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(out, { recursive: true })
const shot = await framer.screenshot("BjqrvIntT", { format: "png", scale: 1 })
fs.writeFileSync(path.join(out, "collection-copy.png"), shot.data)

function slim(n, acc = []) {
    if (!n) return acc
    const a = n.attributes || {}
    acc.push({
        id: n.id,
        name: n.name,
        type: n.type,
        text: a.text,
        visible: a.visible,
        $control__index: a.$control__index,
        $control__showIndex: a.$control__showIndex,
    })
    for (const c of n.children || []) slim(c, acc)
    return acc
}

console.log(
    JSON.stringify(
        {
            project: info.name,
            typeField,
            titleField,
            items,
            nodes: meta.flatMap((n) => slim(n)),
            shotBytes: shot.data.length,
        },
        null,
        2
    )
)

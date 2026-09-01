function walk(n, fn) {
    fn(n)
    for (const c of n.children || []) walk(c, fn)
}

const files = await framer.getCodeFiles()
const grain = files.find((f) => f.name === "Paper_Grain.tsx")
if (!grain) throw new Error("Paper_Grain.tsx missing")
if (!grain.content.includes("useIsStaticRenderer")) {
    throw new Error("Paper_Grain missing useIsStaticRenderer freeze")
}

const nav = await framer.agent.serialize({ id: "Ebz57iEJS", depth: 10 })
let vale = 0
let selected = 0
walk(nav, (n) => {
    const blob = `${n.name || ""} ${JSON.stringify(n.attributes || {})}`
    if (/\bVALE\b/.test(blob) || n.name === "VALE Layer 1" || n.name === "VALE Layer 2") vale++
    if (n.name === "Selected Work") selected++
})
if (vale) throw new Error(`Nav still has VALE leftovers (${vale})`)
if (selected) throw new Error("Nav still has hidden Selected Work")

const work = (await framer.getCollections())[0]
const fields = await work.getFields()
if (fields.some((f) => f.name === "Date")) throw new Error("CMS Date field still present")

console.log(JSON.stringify({ ok: true, fields: fields.map((f) => f.name) }))

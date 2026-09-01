const files = await framer.getCodeFiles()
const pages = await framer.getNodesWithType("WebPageNode")
const comps = await framer.getNodesWithType("ComponentNode")

const refs = new Set()
const textBlobs = []

async function collect(id) {
    const ser = await framer.agent.serialize({ id, depth: 8 }, {})
    const s = JSON.stringify(ser)
    textBlobs.push(s)
    const re = /codeFile\/([A-Za-z0-9_]+)/g
    let m
    while ((m = re.exec(s))) refs.add(m[1])
}

for (const p of pages || []) {
    if (p.path) await collect(p.id)
}
for (const c of comps || []) await collect(c.id)

const blob = textBlobs.join("\n")

const report = files.map((f) => {
    const base = f.name.replace(/\.tsx$/i, "")
    const inRefs = refs.has(f.id)
    const nameHit =
        blob.includes(base) ||
        blob.includes(`codeFile/${f.id}`) ||
        (f.exports || []).some((e) => e.name && blob.includes(e.name))
    return {
        id: f.id,
        name: f.name,
        exports: (f.exports || []).map((e) => e.name),
        inRefs,
        nameHit,
        used: inRefs || nameHit,
    }
})

return {
    unused: report.filter((r) => !r.used),
    used: report.filter((r) => r.used),
    refs: [...refs].sort(),
}

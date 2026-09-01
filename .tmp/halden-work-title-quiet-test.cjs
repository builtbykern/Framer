function fail(msg) {
    throw new Error(msg)
}

function walk(node, acc, depth = 0) {
    if (!node || depth > 16) return acc
    const a = node.attributes || {}
    if (node.type === "RichTextNode" || a.fontName || a.textStylePreset) {
        acc.push({
            id: node.id,
            textStylePreset: a.textStylePreset,
            fontName: a.fontName,
            fontSize: a.fontSize,
            fontWeight: a.fontWeight,
        })
    }
    for (const c of node.children || []) walk(c, acc, depth + 1)
    return acc
}

const styles = await framer.getTextStyles()
const title = (styles || []).find((s) => s.name === "Title")
if (!title) fail("Title text style must exist")
const family = title.font?.family || title.font?.fontFamily
if (family !== "IBM Plex Sans") fail(`Title must be IBM Plex Sans, got ${family}`)
const size = String(title.fontSize || title.size)
if (size !== "40px") fail(`Title size 40px, got ${size}`)

const workRoot = await framer.agent.getNode(
    { id: "fpoP3kuA4", depth: 14 },
    { pagePath: "/work/:Work" }
)
const titles = walk(workRoot, []).filter((t) => /gPAtEpWYL$/.test(t.id) || t.id === "gPAtEpWYL")
if (titles.length < 1) fail("Work series title nodes missing")
for (const t of titles) {
    if (t.textStylePreset === "Display") {
        fail(`Work title ${t.id} still uses Display`)
    }
    if (t.textStylePreset !== "Title") {
        fail(`Work title ${t.id} must use Title, got ${t.textStylePreset || t.fontName}`)
    }
}

console.log(JSON.stringify({ ok: true, titles: titles.map((t) => t.id) }))

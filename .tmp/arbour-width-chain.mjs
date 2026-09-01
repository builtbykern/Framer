async function chain(id) {
    const out = []
    let cur = id
    for (let i = 0; i < 8; i++) {
        if (!cur) break
        const s = await framer.agent.serialize({ id: cur, depth: 0 }, {})
        const a = s.attributes || {}
        out.push({
            id: cur,
            name: s.name,
            w: a.width ?? null,
            mw: a.maxWidth ?? null,
            pad: a.padding ?? null,
        })
        const n = await framer.getNode(cur)
        cur = n?.parentId || n?.$parentId || null
    }
    return out
}

const pages = await framer.getNodesWithType("WebPageNode")
const home = pages.find((p) => p.path === "/")
const ser = await framer.agent.serialize({ id: home.id, depth: 5 }, {})
const desk = (ser.children || []).find((b) => /Desktop/i.test(b.name || ""))
let journalDeckId = null
let processListId = null
function walk(n) {
    if (!n) return
    if (n.name === "Journal Deck") journalDeckId = n.id
    if (n.name === "Process List") processListId = n.id
    for (const c of n.children || []) walk(c)
}
walk(desk)

return {
    processListId,
    journalDeckId,
    process: processListId ? await chain(processListId) : null,
    journalDeck: journalDeckId ? await chain(journalDeckId) : null,
    stats: await chain("CMv32_lLx"),
}

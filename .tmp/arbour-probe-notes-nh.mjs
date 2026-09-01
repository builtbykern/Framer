const pages = await framer.getNodesWithType("WebPageNode")
const notes = pages.find((p) => p.path === "/notes")
const ser = await framer.agent.serialize({ id: notes.id, depth: 4 }, {})
for (const bp of ser.children || []) {
    const atm = (bp.children || []).find((c) => c.name === "Atmosphere")
    console.log(
        bp.name,
        atm && {
            id: atm.id,
            kids: (atm.children || []).map((c) => c.name + " " + c.id),
        },
    )
}

const nh = pages.find((p) => p.path === "/neighbourhoods")
const serN = await framer.agent.serialize({ id: nh.id, depth: 8 }, {})
const hits = []
function walk(n, bp) {
    if (!n) return
    const display = n.attributes?.$componentDisplayName || ""
    if (/TerritoryHover/i.test(n.name || display)) {
        hits.push({
            bp,
            id: n.id,
            accent: n.attributes?.$control__accent,
            showView: n.attributes?.$control__showView,
        })
    }
    for (const c of n.children || []) walk(c, bp)
}
for (const bp of serN.children || []) walk(bp, bp.name)
console.log(JSON.stringify(hits, null, 2))

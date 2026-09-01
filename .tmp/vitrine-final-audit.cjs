const fs = require("fs")
const dir = "/Users/noel/Desktop/Framer/.tmp/vitrine-shots"

const info = await framer.getProjectInfo()
if (info.name !== "Fair Platform") throw new Error("wrong project: " + info.name)

const shots = {}
for (const [id, name] of [
    ["WQLkyLRf1", "home-desktop.jpg"],
    ["t62LHpSTa", "home-tablet.jpg"],
    ["u75vHQkAR", "home-phone.jpg"],
    ["dKIZmzj_1", "piece-desktop.jpg"],
    ["gFY0Qf8vi", "piece-tablet.jpg"],
    ["RRanDQOK5", "piece-phone.jpg"],
]) {
    const r = await framer.screenshot(id, { format: "jpeg", scale: 1 })
    fs.writeFileSync(`${dir}/${name}`, r.data)
    shots[name] = r.data.length
}

const pages = await framer.agent.serializeNodes({
    ids: ["augiA20Il", "FZFYEKdG1", "eT5aUzOXW", "pTPGQ4L6O", "GPILtKFJP"],
    depth: 1,
    attributeFilter: ["id", "name", "path", "layoutTemplate", "codeFile", "component"],
})

const homeTree = await framer.agent.serializeNodes(
    {
        ids: ["WQLkyLRf1", "t62LHpSTa", "u75vHQkAR"],
        depth: 2,
        attributeFilter: ["id", "name", "stackDirection", "overflow", "hideScrollbars", "codeFile", "component", "htmlTag"],
    },
    { pagePath: "/" }
)

const card = await framer.agent.serializeNodes({
    ids: ["OdvHkNWXz"],
    depth: 1,
    attributeFilter: ["id", "name"],
})

const cms = await framer.agent.serializeNodes({
    ids: ["tZytgw_pu", "lkZBIAg86", "RXZYU_SGB", "EDUlD2m19", "vWwUi2iXi", "X3kJRxUxX", "zyvPp0qI0", "N8rSuGdDW"],
    depth: 0,
})
const rows = cms.map((it) => ({
    title: it.attributes?.$control__title,
    slug: it.attributes?.$control__slug,
    module: it.attributes?.$control__module,
}))

const col = await framer.agent.serializeNodes({ ids: ["t2sbY17Aq"], depth: 0 })

const copyNodes = await framer.agent.serializeNodes({
    ids: ["odgkshwbV", "oSHXrizqB", "FnQbHIoGD", "DZIMTQiKB", "BU8_2gg2U", "axW_NfbLI", "R2pga7_AP", "QhfNwiny9"],
    depth: 3,
    attributeFilter: ["id", "name", "text", "link"],
})

function texts(nodes, acc = []) {
    const list = Array.isArray(nodes) ? nodes : [nodes]
    for (const n of list) {
        if (!n) continue
        const t = n.attributes?.text
        if (typeof t === "string" && t.trim()) acc.push(t)
        if (n.children) texts(n.children, acc)
    }
    return acc
}

const allText = texts(copyNodes)
const hay = JSON.stringify({ allText, rows, pages, homeTree }).toLowerCase()
const leftovers = ["glass hours", "halden", "lorem", "ipsum", "quarto", "shopify"].filter((n) => hay.includes(n))

const colKeys = col[0] ? Object.keys(col[0].attributes || {}) : []

const proof = {
    project: info.name,
    shots,
    pages: pages.map((p) => ({
        id: p.id,
        name: p.name,
        path: p.attributes?.path,
        layoutTemplate: p.attributes?.layoutTemplate ?? null,
        children: (p.children || []).map((c) => ({ id: c.id, name: c.name, type: c.type, component: c.component, codeFile: c.attributes?.codeFile })),
    })),
    homeBreakpoints: homeTree.map((bp) => ({
        id: bp.id,
        name: bp.name,
        kids: (bp.children || []).map((c) => ({
            id: c.id,
            name: c.name,
            type: c.type,
            component: c.component,
            codeFile: c.attributes?.codeFile ?? null,
            stackDirection: c.attributes?.stackDirection,
            overflow: c.attributes?.overflow,
        })),
    })),
    cardVariants: (card[0]?.children || []).map((c) => c.name),
    rows,
    leftovers,
    allText,
    colAttrKeys: colKeys,
    colName: col[0]?.name,
}

fs.writeFileSync("/Users/noel/Desktop/Framer/.tmp/vitrine-goal-proof.json", JSON.stringify(proof, null, 2))
console.log(JSON.stringify(proof, null, 2))

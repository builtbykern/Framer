const fs = require("fs")
const dir = "/Users/noel/Desktop/Framer/.tmp/vitrine-shots"

const info = await framer.getProjectInfo()
if (info.name !== "Fair Platform") throw new Error(info.name)

const restore = await framer.agent.applyChanges(
    [
        'SET QYwZhiOCq height="300px";',
        'SET BZgqwOKfTQYwZhiOCq height="253px";',
        'SET GLlag6b9RQYwZhiOCq height="266px";',
        'SET S4aeyJLQaQYwZhiOCq height="216px";',
        'SET omF0gODuR maxWidth="100%";',
        'SET BZgqwOKfT maxWidth="100%";',
        'SET GLlag6b9R maxWidth="100%";',
        'SET S4aeyJLQa maxWidth="100%";',
        'SET O2btPltNw tapEffect.scale="0.98" tapEffect.opacity="1" tapEffect.transition="tween 0.23,1,0.32,1 0.15s 0s";',
        'SET augiA20Il layoutTemplate="null";',
    ].join(" "),
    { pagePath: "/" }
)

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
    depth: 0,
    attributeFilter: ["id", "name", "path", "layoutTemplate"],
})

const phone = await framer.agent.serializeNodes(
    { ids: ["u75vHQkAR"], depth: 2, attributeFilter: ["id", "name", "stackDirection", "overflow", "component", "codeFile", "maxWidth", "width"] },
    { pagePath: "/" }
)

const copy = await framer.agent.serializeNodes({
    ids: ["tVu2ncruf", "J1kd1wjJe", "pWw0UM2JG", "R2pga7_AP"],
    depth: 4,
    attributeFilter: ["id", "name", "text"],
})

const cms = await framer.agent.serializeNodes({
    ids: ["tZytgw_pu", "lkZBIAg86", "RXZYU_SGB", "EDUlD2m19", "vWwUi2iXi", "X3kJRxUxX", "zyvPp0qI0", "N8rSuGdDW"],
    depth: 0,
})
const rows = cms.map((it) => ({ title: it.attributes?.$control__title, slug: it.attributes?.$control__slug, module: it.attributes?.$control__module }))

const hay = JSON.stringify({ copy, rows }).toLowerCase()
const leftovers = ["glass hours", "halden", "lorem", "ipsum", "quarto", "shopify"].filter((n) => hay.includes(n))

const proof = {
    project: info.name,
    restore: { message: restore.message, errors: restore.errors },
    pages: pages.map((p) => ({ id: p.id, name: p.name, path: p.attributes?.path, layoutTemplate: p.attributes?.layoutTemplate ?? null })),
    phoneChildren: phone[0]?.children?.map((c) => ({ id: c.id, name: c.name, type: c.type, stackDirection: c.attributes?.stackDirection })),
    rows,
    leftovers,
    shots,
}

fs.writeFileSync("/Users/noel/Desktop/Framer/.tmp/vitrine-goal-proof.json", JSON.stringify(proof, null, 2))
console.log(JSON.stringify(proof, null, 2))

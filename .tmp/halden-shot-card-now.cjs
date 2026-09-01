const fs = require("fs")
const path = require("path")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const card = await framer.agent.serializeNodes(
    { ids: ["gSGwySyKV"], depth: 2 },
    { pagePath: "/" }
)
function brief(n, d = 0) {
    if (!n || d > 2) return null
    const a = n.attributes || {}
    return {
        id: n.id,
        name: n.name,
        pos: a.position,
        w: a.width,
        h: a.height,
        vis: a.visible,
        kids: (n.children || []).map((c) => brief(c, d + 1)).filter(Boolean),
    }
}
const out = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(out, { recursive: true })
const shots = {}
for (const [id, name] of [
    ["BjqrvIntT", "t-now.jpg"],
    ["WQLkyLRf1", "d-now.jpg"],
]) {
    const r = await framer.screenshot(id, { format: "jpeg", scale: 1 })
    fs.writeFileSync(path.join(out, name), r.data)
    shots[name] = r.data.length
}
console.log(
    JSON.stringify(
        { project: info.name, card: brief(card[0]), shots },
        null,
        2
    )
)

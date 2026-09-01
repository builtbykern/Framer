const fs = require("fs")
const path = require("path")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const cover = await framer.agent.getNode({ id: "nt9Gs3MMs" }, { pagePath: "/" })
const card = await framer.agent.getNode({ id: "gSGwySyKV" }, { pagePath: "/" })
const a = cover?.attributes || {}
const c = card?.attributes || {}
const out = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(out, { recursive: true })
const shots = {}
for (const [id, name] of [
    ["WQLkyLRf1", "desktop-stack.jpg"],
    ["BjqrvIntT", "tablet-stack.jpg"],
    ["nyI5jW7lA", "phone-stack.jpg"],
]) {
    try {
        const r = await framer.screenshot(id, { format: "jpeg", scale: 2 })
        fs.writeFileSync(path.join(out, name), r.data)
        shots[name] = r.data.length
    } catch (e) {
        shots[name] = String(e)
    }
}
console.log(
    JSON.stringify({
        project: info.name,
        cover: {
            position: a.position,
            width: a.width,
            height: a.height,
            top: a.top,
            left: a.left,
        },
        card: { layout: c.layout, gap: c.gap, height: c.height, overflow: c.overflow },
        shots,
    })
)

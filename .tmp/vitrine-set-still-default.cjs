const lint = await framer.agent.applyChanges(
    'SET MVYFn4kz9 initialValue="https://framerusercontent.com/images/uuqJtsVz2GJQEbive50JAThDsKs.jpg";'
)

const card = await framer.agent.serializeNodes({ ids: ["OdvHkNWXz"], depth: 0 })
const vars = (card[0]?.variables || [])
    .filter((v) => v.type === "image")
    .map((v) => ({ id: v.id, name: v.name, initialValue: v.initialValue }))

const fs = require("fs")
const path = require("path")
const dir = "/Users/noel/Desktop/Framer/.tmp/vitrine-shots"
fs.mkdirSync(dir, { recursive: true })

for (const [id, name] of [
    ["WQLkyLRf1", "home-desktop.jpg"],
    ["t62LHpSTa", "home-tablet.jpg"],
    ["u75vHQkAR", "home-phone.jpg"],
    ["omF0gODuR", "card-square.jpg"],
]) {
    const r = await framer.screenshot(id, { format: "jpeg", scale: 1 })
    fs.writeFileSync(path.join(dir, name), r.data)
}

console.log(JSON.stringify({ lint, vars }, null, 2))

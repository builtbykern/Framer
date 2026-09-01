const fs = require("fs")
const path = require("path")
const dir = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(dir, { recursive: true })

const desktopKids = await framer.agent.serializeNodes({
    ids: ["WQLkyLRf1", "BjqrvIntT", "nyI5jW7lA"],
    depth: 2,
    attributeFilter: ["collectionList", "left", "width", "height", "name"],
})

const workPage = await framer.agent.serializeNodes({
    ids: ["fpoP3kuA4"],
    depth: 2,
    attributeFilter: ["path", "left", "width", "height"],
})

const shots = {}
for (const [id, name] of [
    ["fpoP3kuA4", "sotd-work-page.jpg"],
    ["nizhx6wAX", "sotd-404.jpg"],
    ["xmBenkfAk", "sotd-slot-column.jpg"],
]) {
    try {
        const r = await framer.screenshot(id, { format: "jpeg", scale: 1 })
        fs.writeFileSync(path.join(dir, name), r.data)
        shots[name] = r.data.length
    } catch (err) {
        shots[name] = String(err)
    }
}

const preview = await framer.agent.publish({ action: "preview" })

console.log(
    JSON.stringify(
        {
            desktopKids,
            workPage,
            shots,
            preview,
        },
        null,
        2
    ).slice(0, 14000)
)

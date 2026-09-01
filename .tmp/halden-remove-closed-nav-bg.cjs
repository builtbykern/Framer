const fs = require("fs")

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const applied = await framer.agent.applyChanges(
    "SET nyI5jW7lAbEk1u9XFC fill=null;",
    { pagePath: "/" }
)

const shot = await framer.screenshot("nyI5jW7lA", {
    format: "jpeg",
    scale: 1,
})
const path = "/Users/noel/Desktop/Framer/.tmp/halden-nav-final/phone-no-nav-bg.jpg"
fs.writeFileSync(path, shot.data)

console.log(JSON.stringify({ ok: true, applied, path }, null, 2))

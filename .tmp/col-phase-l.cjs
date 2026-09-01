const fs = require("fs")
const path = require("path")
const dir = "/Users/noel/Desktop/Framer/.tmp/col-shots"
fs.mkdirSync(dir, { recursive: true })

const polish = await framer.agent.applyChanges(
    `
SET sktx1Cgoo maxWidth="920px";
SET Au0TUkArbsktx1Cgoo padding="36px 24px 64px 24px";
SET zuBLQ4Tqrsktx1Cgoo padding="24px 16px 56px 16px";
SET nD9lSl2zovjpexXlI5 padding="56px 24px 80px 24px";
SET a1ACmQjflvjpexXlI5 padding="40px 16px 64px 16px";
SET qQuiq1fWwM6pPOywM4 padding="56px 24px 80px 24px";
SET jngco5TMlM6pPOywM4 padding="40px 16px 64px 16px";
SET gmUG273O2Wm_m5zFZy padding="56px 24px";
SET w78PvaGOnWm_m5zFZy padding="40px 16px";
`.replace(/\n+/g, " "),
    { pagePath: "/" }
)

const shots = {}
for (const [id, name] of [
    ["WQLkyLRf1", "home-desktop.jpg"],
    ["Ktwi4KHu8", "home-tablet.jpg"],
    ["yhVuy25Kb", "home-phone.jpg"],
    ["HUNupzO9a", "work-desktop.jpg"],
    ["zuBLQ4Tqr", "work-phone.jpg"],
]) {
    const r = await framer.screenshot(id, { format: "jpeg", scale: 1 })
    fs.writeFileSync(path.join(dir, name), r.data)
    shots[name] = r.data.length
}

let vekter = null
try {
    vekter = await framer.agent.readProject(
        [
            { type: "screenshot", id: "WQLkyLRf1" },
            { type: "screenshot", id: "Ktwi4KHu8" },
            { type: "screenshot", id: "yhVuy25Kb" },
        ],
        { pagePath: "/" }
    )
} catch (e) {
    vekter = { error: String(e) }
}

const phone = await framer.agent.serializeNodes(
    {
        ids: ["yhVuy25Kb"],
        depth: 3,
        attributeFilter: ["name", "width", "height", "collectionList", "$rect"],
    },
    { pagePath: "/" }
)

console.log(JSON.stringify({ polish, shots, vekter, phone }, null, 2).slice(0, 16000))

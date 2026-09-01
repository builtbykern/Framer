const fs = require("fs")
const path = require("path")
const dir = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(dir, { recursive: true })

const veil = await framer.getCodeFile("Page_Veil.tsx")
const drift = await framer.getCodeFile("Drift_Plane.tsx")
fs.writeFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Page_Veil.tsx",
    veil.content
)

const shots = {}
for (const [id, name] of [
    ["WQLkyLRf1", "sotd-now-desktop.jpg"],
    ["BjqrvIntT", "sotd-now-tablet.jpg"],
    ["nyI5jW7lA", "sotd-now-phone.jpg"],
    ["H9TnltXVB", "sotd-now-slot.jpg"],
]) {
    const r = await framer.screenshot(id, { format: "jpeg", scale: 1 })
    fs.writeFileSync(path.join(dir, name), r.data)
    shots[name] = r.data.length
}

console.log(
    JSON.stringify(
        {
            veilHasNavigate: veil.content.includes("halden:veil-navigate"),
            veilHasCoverThenGo: veil.content.includes("coverThenGo"),
            driftLiveHasOpenCard: drift.content.includes("openCardLink"),
            driftLiveHasVeil: drift.content.includes("halden:veil-navigate"),
            driftLiveHasCms: drift.content.includes("fillDriftCover"),
            shots,
        },
        null,
        2
    )
)

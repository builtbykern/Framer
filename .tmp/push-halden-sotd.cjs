const fs = require("fs")
const path = require("path")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const src = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Drift_Plane.tsx",
    "utf8"
)
if (!src.includes("halden:veil-navigate")) {
    throw new Error("missing veil navigate")
}
if (!src.includes('DRIFT_VEIL_BLUR = "blur(4px)"')) {
    throw new Error("missing enter veil")
}
if (!src.includes("function openCardLink")) {
    throw new Error("missing openCardLink")
}

const drift = await framer.getCodeFile("Drift_Plane.tsx")
const file = await drift.setFileContent(src)
const typeErrors = await file.typecheck({ strict: true })

const applied = await framer.agent.applyChanges(
    [
        'SET RV7bjlgdh $control__workList.0="H9TnltXVB";',
        'SET BjqrvIntTRV7bjlgdh $control__workList.0="H9TnltXVB";',
        'SET nyI5jW7lARV7bjlgdh $control__workList.0="H9TnltXVB";',
        'SET H9TnltXVB left="8000px" top="0px" width="390px" height="auto";',
    ].join(" "),
    { pagePath: "/" }
)

const dir = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(dir, { recursive: true })
const shots = {}
for (const [id, name] of [
    ["WQLkyLRf1", "sotd-after-desktop.jpg"],
    ["BjqrvIntT", "sotd-after-tablet.jpg"],
    ["nyI5jW7lA", "sotd-after-phone.jpg"],
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
            { type: "screenshot", id: "BjqrvIntT" },
            { type: "screenshot", id: "nyI5jW7lA" },
        ],
        { pagePath: "/" }
    )
} catch (e) {
    vekter = { error: String(e) }
}

let review = null
try {
    review = await framer.agent.reviewChanges?.({ pagePath: "/" })
} catch (e) {
    review = { error: String(e) }
}

console.log(
    JSON.stringify(
        {
            project: info.name,
            typeErrors,
            applied,
            shots,
            vekter,
            review,
        },
        null,
        2
    )
)

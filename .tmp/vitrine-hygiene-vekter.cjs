const info = await framer.getProjectInfo()
if (info.name !== "Fair Platform") throw new Error(info.name)

let empty = null
try {
    empty = await framer.agent.serializeNodes({ ids: ["i5CphXhmV"], depth: 1 })
} catch (e) {
    empty = String(e)
}

const lint = await framer.agent.applyChanges(
    [
        'SET vWwUi2iXi $control__still.src="https://framerusercontent.com/images/HE4PUm8hPzFtKSaS5YTkQSVk.jpg" $control__still.alt="Stack of folded cloth";',
        'SET N8rSuGdDW $control__still.src="https://framerusercontent.com/images/F5tdaXFDo470my5MJpcRu4YFDdw.jpg" $control__still.alt="Small vase on wood";',
        'SET 41c8b9ae-e604-40b6-9d37-a14c3803c179 light="rgb(176, 176, 172)";',
        'SET t5y0e5eot textColor="rgb(176, 176, 172)";',
        'SET BEFvspdZd textColor="rgb(176, 176, 172)";',
    ].join(" "),
    { pagePath: "/" }
)

const fs = require("fs")
const dir = "/Users/noel/Desktop/Framer/.tmp/vitrine-shots"
const vekter = await framer.agent.readProject(
    [
        { type: "screenshot", id: "WQLkyLRf1" },
        { type: "screenshot", id: "t62LHpSTa" },
        { type: "screenshot", id: "u75vHQkAR" },
        { type: "screenshot", id: "dKIZmzj_1" },
        { type: "screenshot", id: "gFY0Qf8vi" },
        { type: "screenshot", id: "RRanDQOK5" },
    ],
    { pagePath: "/" }
)

for (const [id, name] of [
    ["WQLkyLRf1", "home-desktop.jpg"],
    ["t62LHpSTa", "home-tablet.jpg"],
    ["u75vHQkAR", "home-phone.jpg"],
    ["dKIZmzj_1", "piece-desktop.jpg"],
    ["gFY0Qf8vi", "piece-tablet.jpg"],
    ["RRanDQOK5", "piece-phone.jpg"],
    ["tVu2ncruf", "house-desktop.jpg"],
]) {
    const r = await framer.screenshot(id, { format: "jpeg", scale: 1 })
    fs.writeFileSync(`${dir}/${name}`, r.data)
}

console.log(
    JSON.stringify(
        {
            empty,
            lint: { message: lint.message, errors: lint.linter?.errors },
            vekter,
        },
        null,
        2
    )
)

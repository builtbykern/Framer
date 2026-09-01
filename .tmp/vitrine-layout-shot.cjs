const fs = require("fs")
const dir = "/Users/noel/Desktop/Framer/.tmp/vitrine-shots"

const info = await framer.getProjectInfo()
if (info.name !== "Fair Platform") throw new Error(info.name)

const pad = await framer.agent.applyChanges(
    [
        'SET t62LHpSTaYuQho50Zq padding="32px 22px 32px 22px";',
        'SET u75vHQkARYuQho50Zq padding="24px 16px 28px 16px";',
        'SET YuQho50Zq fontSize="auto-fit(100%)" letterSpacing="-0.07em" lineHeight="1";',
    ].join(" "),
    { pagePath: "/" }
)

for (const [id, name] of [
    ["WQLkyLRf1", "home-desktop.jpg"],
    ["t62LHpSTa", "home-tablet.jpg"],
    ["u75vHQkAR", "home-phone.jpg"],
    ["dKIZmzj_1", "piece-desktop.jpg"],
]) {
    const r = await framer.screenshot(id, { format: "jpeg", scale: 1 })
    fs.writeFileSync(`${dir}/${name}`, r.data)
}

console.log(
    JSON.stringify(
        {
            pad: { message: pad.message, errors: pad.linter?.errors, warnings: pad.linter?.warnings },
        },
        null,
        2
    )
)

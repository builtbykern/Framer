const fs = require("fs")
const dir = "/Users/noel/Desktop/Framer/.tmp/vitrine-shots"

const info = await framer.getProjectInfo()
if (info.name !== "Fair Platform") throw new Error(info.name)

const lint = await framer.agent.applyChanges(
    [
        'SET KVgGkkS4z textStylePreset="Body" link.textColor="rgb(120, 120, 120)" link.hover.textColor="rgb(10, 10, 10)" link.current.textColor="rgb(10, 10, 10)";',
        'SET ViBjWFaCI textStylePreset="Body" link.textColor="rgb(120, 120, 120)" link.hover.textColor="rgb(10, 10, 10)" link.current.textColor="rgb(10, 10, 10)";',
        'SET aqpa10Il4 textStylePreset="Body" link.textColor="rgb(120, 120, 120)" link.hover.textColor="rgb(10, 10, 10)" link.current.textColor="rgb(10, 10, 10)";',
        'SET yZes1fNVs padding="28px 32px 22px 32px";',
        'SET orXs4NZw2 gap="16px";',
        'SET Nx5jccWgMyZes1fNVs padding="22px 22px 18px 22px";',
        'SET tKUMOkWpPyZes1fNVs padding="18px 16px 14px 16px";',
        'SET tVu2ncruf width="1440px";',
        'SET J1kd1wjJe width="1440px";',
        'SET pWw0UM2JG width="1440px";',
        'SET oSHXrizqB textStylePreset="Body" fontSize="14px" letterSpacing="-0.01em" lineHeight="1.45em" width="560px";',
        'SET DZIMTQiKB textStylePreset="Body" fontSize="14px" letterSpacing="-0.01em" lineHeight="1.45em" width="560px";',
        'SET axW_NfbLI link.href="/";',
    ].join(" "),
    { pagePath: "/" }
)

const shots = {}
for (const [id, name] of [
    ["WQLkyLRf1", "home-desktop.jpg"],
    ["t62LHpSTa", "home-tablet.jpg"],
    ["u75vHQkAR", "home-phone.jpg"],
    ["dKIZmzj_1", "piece-desktop.jpg"],
    ["gFY0Qf8vi", "piece-tablet.jpg"],
    ["RRanDQOK5", "piece-phone.jpg"],
    ["tVu2ncruf", "house-desktop.jpg"],
    ["J1kd1wjJe", "desk-desktop.jpg"],
    ["pWw0UM2JG", "404-desktop.jpg"],
]) {
    const r = await framer.screenshot(id, { format: "jpeg", scale: 1 })
    fs.writeFileSync(`${dir}/${name}`, r.data)
    shots[name] = r.data.length
}

const evidence = await framer.agent.serializeNodes({
    ids: [
        "augiA20Il",
        "FZFYEKdG1",
        "eT5aUzOXW",
        "pTPGQ4L6O",
        "GPILtKFJP",
        "u75vHQkAR",
        "u75vHQkARyAd2lMDSW",
        "IhgjBMpmC",
        "NBF_dDp3H",
        "yAd2lMDSW",
    ],
    depth: 2,
    attributeFilter: [
        "id",
        "name",
        "path",
        "layoutTemplate",
        "stackDirection",
        "overflow",
        "hideScrollbars",
        "codeFile",
        "component",
        "collection",
        "text",
    ],
})

fs.writeFileSync(
    "/Users/noel/Desktop/Framer/.tmp/vitrine-goal-evidence.json",
    JSON.stringify({ project: info.name, lint: { message: lint.message, errors: lint.linter?.errors }, evidence }, null, 2)
)

console.log(
    JSON.stringify(
        {
            lint: { message: lint.message, errors: lint.linter?.errors, warnings: lint.linter?.warnings },
            shots,
        },
        null,
        2
    )
)

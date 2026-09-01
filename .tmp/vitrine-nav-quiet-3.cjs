const fs = require("fs")
const dir = "/Users/noel/Desktop/Framer/.tmp/vitrine-shots"

const info = await framer.getProjectInfo()
if (info.name !== "Fair Platform") throw new Error(info.name)

const nav = await framer.agent.applyChanges(
    [
        'SET KVgGkkS4z textStylePreset="Body" linkStylePreset="Nav Link";',
        'SET ViBjWFaCI textStylePreset="Body" linkStylePreset="Nav Link";',
        'SET aqpa10Il4 textStylePreset="Body" linkStylePreset="Nav Link";',
        'SET yZes1fNVs padding="28px 32px 22px 32px";',
        'SET orXs4NZw2 gap="16px";',
    ].join(" "),
    { pagePath: "/" }
)

const lead = await framer.agent.applyChanges(
    [
        '+TextStylePresetNode leadStyle name="Lead" tag="p" fontName="IBM Plex Sans" fontWeight="500" fontSize="14px" letterSpacing="-0.01em" lineHeight="1.45em" textColor="rgb(120, 120, 120)";',
    ].join(" "),
    { pagePath: "/" }
)

const leadId = lead.renamedIds?.leadStyle || "leadStyle"

const house = await framer.agent.applyChanges(
    `SET tVu2ncruf width="1440px"; SET oSHXrizqB textStylePreset="Lead";`,
    { pagePath: "/info" }
)
const desk = await framer.agent.applyChanges(
    `SET J1kd1wjJe width="1440px"; SET DZIMTQiKB textStylePreset="Lead";`,
    { pagePath: "/contact" }
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

function brief(r) {
    return { message: r.message, errors: r.errors || r.linter?.errors, renamed: r.renamedIds }
}

console.log(
    JSON.stringify({ nav: brief(nav), lead: brief(lead), leadId, house: brief(house), desk: brief(desk), shots }, null, 2)
)

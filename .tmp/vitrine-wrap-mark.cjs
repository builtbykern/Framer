const fs = require("fs")
const dir = "/Users/noel/Desktop/Framer/.tmp/vitrine-shots"

const info = await framer.getProjectInfo()
if (info.name !== "Fair Platform") throw new Error(info.name)

const wrap = await framer.agent.applyChanges(
    [
        '+FrameNode markWrap parent="WQLkyLRf1" name="Mark Floor" index="2" layout="stack" stackDirection="vertical" stackDistribution="start" width="1fr" height="auto" padding="96px 28px 56px 28px";',
        'MOVE YuQho50Zq parent="markWrap" index="0";',
    ].join(" "),
    { pagePath: "/" }
)

const wrapId = wrap.renamedIds?.markWrap || "markWrap"

const tabletBodies = await framer.agent.applyChanges(
    [
        'SET hRNnw_VA2oSHXrizqB width="1fr";',
        'SET XX7urzdEPDZIMTQiKB width="1fr";',
    ].join(" "),
    { pagePath: "/info" }
)

const item = await framer.agent.serializeNodes({ ids: ["tZytgw_pu"], depth: 1 })
fs.writeFileSync("/Users/noel/Desktop/Framer/.tmp/vitrine-cms-item.json", JSON.stringify(item, null, 2))

const shots = {}
for (const [id, name] of [
    ["WQLkyLRf1", "home-desktop.jpg"],
    ["t62LHpSTa", "home-tablet.jpg"],
    ["u75vHQkAR", "home-phone.jpg"],
    ["dKIZmzj_1", "piece-desktop.jpg"],
    ["gFY0Qf8vi", "piece-tablet.jpg"],
    ["RRanDQOK5", "piece-phone.jpg"],
    ["hRNnw_VA2", "house-tablet.jpg"],
    ["EU24xAeMI", "house-phone.jpg"],
]) {
    const r = await framer.screenshot(id, { format: "jpeg", scale: 1 })
    fs.writeFileSync(`${dir}/${name}`, r.data)
    shots[name] = r.data.length
}

const phone = await framer.agent.serializeNodes(
    { ids: ["u75vHQkAR"], depth: 2, attributeFilter: ["id", "name", "stackDirection", "overflow", "layoutTemplate", "padding"] },
    { pagePath: "/" }
)

console.log(
    JSON.stringify(
        {
            wrap: { message: wrap.message, errors: wrap.errors, renamed: wrap.renamedIds, wrapId },
            tabletBodies: { message: tabletBodies.message, errors: tabletBodies.errors },
            itemPreview: JSON.stringify(item).slice(0, 1500),
            phoneKids: phone[0]?.children?.map((c) => ({ id: c.id, name: c.name, type: c.type })),
            shots,
        },
        null,
        2
    )
)

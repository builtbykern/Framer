const fs = require("fs")
const dir = "/Users/noel/Desktop/Framer/.tmp/vitrine-shots"

const info = await framer.getProjectInfo()
if (info.name !== "Fair Platform") throw new Error(info.name)

const nav = await framer.agent.applyChanges(
    [
        '+FrameNode navLead parent="yZes1fNVs" name="Lead" index="0" layout="stack" stackDirection="horizontal" stackDistribution="start" stackAlignment="center" width="1fr" height="auto";',
        'MOVE QhfNwiny9 parent="navLead" index="0";',
        'MOVE KVgGkkS4z parent="yZes1fNVs" index="1";',
        'SET orXs4NZw2 width="1fr" stackDistribution="end";',
    ].join(" "),
    { pagePath: "/" }
)

const shots = {}
for (const [id, name] of [
    ["WQLkyLRf1", "home-desktop.jpg"],
    ["t62LHpSTa", "home-tablet.jpg"],
    ["u75vHQkAR", "home-phone.jpg"],
    ["dKIZmzj_1", "piece-desktop.jpg"],
    ["tVu2ncruf", "house-desktop.jpg"],
    ["J1kd1wjJe", "desk-desktop.jpg"],
]) {
    const r = await framer.screenshot(id, { format: "jpeg", scale: 1 })
    fs.writeFileSync(`${dir}/${name}`, r.data)
    shots[name] = r.data.length
}

const row = await framer.agent.serializeNodes({
    ids: ["yZes1fNVs"],
    depth: 2,
    attributeFilter: ["id", "name", "width", "stackDistribution", "stackDirection"],
})

console.log(
    JSON.stringify(
        {
            project: info.name,
            nav: { message: nav.message, errors: nav.errors, renamed: nav.renamedIds },
            row,
            shots,
        },
        null,
        2
    )
)

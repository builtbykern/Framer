const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)
const year = await framer.agent.getNode({ id: "XwtyrQVdF" }, { pagePath: "/" })
const a = year?.attributes || {}
const shots = await framer.agent.readProject(
    [
        { type: "screenshot", id: "BjqrvIntT" },
        { type: "screenshot", id: "nyI5jW7lA" },
    ],
    { pagePath: "/" }
)
function url(res, i) {
    const row = res?.results?.[i]
    return row?.image_url || row?.url || row?.error || null
}
console.log(
    JSON.stringify(
        {
            project: info.name,
            fontName: a.fontName,
            preset: a.textStylePreset,
            fontSize: a.fontSize,
            tablet: url(shots, 0),
            phone: url(shots, 1),
        },
        null,
        2
    )
)

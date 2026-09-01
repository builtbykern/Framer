const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const cover = await framer.agent.getNode({ id: "nt9Gs3MMs" }, { pagePath: "/" })
const a = cover?.attributes || {}
const keys = Object.keys(a).filter((k) =>
    /fill|image|bg|overflow|height|width|radius|visible/i.test(k)
)
const kids = await framer.agent.serializeNodes(
    { ids: ["nt9Gs3MMs", "cMyCjMOpL", "yGFlVus2I"], depth: 2 },
    { pagePath: "/" }
)
function brief(n) {
    const x = n?.attributes || {}
    return {
        id: n?.id,
        name: n?.name,
        type: n?.type,
        w: x.width,
        h: x.height,
        vis: x.visible,
        fill: x.fill,
        background: x.background,
        overflow: x.overflow,
        kids: (n.children || []).map((c) => ({
            id: c.id,
            name: c.name,
            type: c.type,
            w: c.attributes?.width,
            h: c.attributes?.height,
            fill: c.attributes?.fill,
        })),
    }
}
console.log(
    JSON.stringify(
        {
            project: info.name,
            coverKeys: keys,
            cover: brief(kids[0]),
            stillGrid: brief(kids[1]),
            series: brief(kids[2]),
            rawFill: a.fill,
            rawImage: a.backgroundImage || a.image,
        },
        null,
        2
    )
)

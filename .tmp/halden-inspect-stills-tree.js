const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

function brief(n, depth = 0) {
    if (!n || depth > 4) return null
    const a = n.attributes || {}
    const kids = (n.children || []).map((c) => brief(c, depth + 1)).filter(Boolean)
    return {
        id: n.id,
        name: n.name,
        type: n.type,
        w: a.width,
        h: a.height,
        vis: a.visible,
        pos: a.position,
        overflow: a.overflow,
        kids: kids.length ? kids : undefined,
    }
}

const tablet = await framer.agent.serializeNodes(
    { ids: ["BjqrvIntTRV7bjlgdh", "BjqrvIntT"], depth: 6 },
    { pagePath: "/" }
)
const card = await framer.agent.serializeNodes(
    { ids: ["gSGwySyKV", "yGFlVus2I", "H9TnltXVB"], depth: 3 },
    { pagePath: "/" }
)

console.log(
    JSON.stringify(
        {
            project: info.name,
            tablet: tablet.map((n) => brief(n)),
            sources: card.map((n) => brief(n)),
        },
        null,
        2
    )
)

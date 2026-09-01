const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const grid = await framer.agent.serialize(
    {
        id: "cMyCjMOpL",
        depth: 4,
        attributeFilter: [
            "name", "width", "height", "position", "layout", "stackDirection",
            "gap", "visible", "opacity", "overflow", "$control__cover",
            "$control__images", "$control__inCollection", "$control__index",
        ],
    },
    { pagePath: "/" }
)
const stills = await framer.agent.serialize(
    {
        id: "yGFlVus2I",
        depth: 2,
        attributeFilter: [
            "name", "width", "height", "$control__cover", "$control__images",
            "$control__inCollection", "$control__index", "$control__gutter",
        ],
    },
    { pagePath: "/" }
)
const meta = await framer.agent.serialize(
    {
        id: "YonVwWSco",
        depth: 3,
        attributeFilter: [
            "name", "width", "height", "layout", "gap", "visible", "opacity",
        ],
    },
    { pagePath: "/" }
)

function walk(n, depth = 0) {
    if (!n) return null
    const a = n.attributes || {}
    const node = {
        id: n.id,
        name: n.name || a.name,
        type: n.type,
        w: a.width,
        h: a.height,
        vis: a.visible,
        gap: a.gap,
        controls: Object.fromEntries(
            Object.entries(a).filter(([k]) => k.startsWith("$control__"))
        ),
    }
    if (n.children?.length) node.kids = n.children.map((c) => walk(c, depth + 1))
    return node
}

console.log(JSON.stringify({
    project: info.name,
    grid: walk(grid),
    stills: walk(stills),
    meta: walk(meta),
}, null, 2))

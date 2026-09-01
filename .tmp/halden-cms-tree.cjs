const walk = (n, depth, acc) => {
    if (!n || depth > 6) return
    const a = n.attributes || {}
    acc.push({
        depth,
        id: n.id,
        name: n.name || a.name,
        type: n.type,
        parentHint: a.parentId,
        vis: a.visible,
        slot: a["$control__workList"],
        view: a["$control__view"],
        cl: a.collectionList ? a.collectionList.collection : undefined,
    })
    for (const c of n.children || []) walk(c, depth + 1, acc)
}

const home = await framer.agent.getNode({ id: "/" }, { pagePath: "/" }).catch(() => null)
const page = await framer.agent.getNode({ }, { pagePath: "/" }).catch(async () => {
    const pages = await framer.getNodesWithType("WebPageNode")
    return pages?.[0]
})

const out = { pageId: page?.id, pageName: page?.name, tree: [] }

const root = page || home
if (root) walk(root, 0, out.tree)

const hit = out.tree.filter(
    (n) =>
        n.id === "H9TnltXVB" ||
        n.id?.includes("H9TnltXVB") ||
        n.id === "RV7bjlgdh" ||
        n.name === "Work" ||
        n.name === "Drift Plane" ||
        n.cl === "Work"
)
out.hits = hit

const list = await framer.agent.getNode({ id: "H9TnltXVB" }, { pagePath: "/" })
out.listParent = {
    parentId: list?.parentId || list?.attributes?.parentId,
    path: list?.path,
    ancestors: list?.ancestors,
}

const card = await framer.agent.getNode({ id: "gSGwySyKV" }, { pagePath: "/" })
out.cardKids = (card?.children || []).map((c) => ({
    id: c.id,
    name: c.name || c.attributes?.name,
    type: c.type,
    vis: c.attributes?.visible,
    w: c.attributes?.width,
    h: c.attributes?.height,
    fill: c.attributes?.fill,
    text: c.attributes?.text,
    controls: Object.fromEntries(
        Object.entries(c.attributes || {}).filter(([k]) => k.startsWith("$control"))
    ),
}))

console.log(JSON.stringify(out, null, 2))

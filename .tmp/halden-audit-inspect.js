const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const pagePath = "/work/:Work"

const gallery = await framer.agent.serializeNodes(
    { ids: ["yn0nMGJJL"], depth: 8 },
    { pagePath }
)
const cover = await framer.agent.getNode({ id: "lgPBjlVA8" }, { pagePath })
const workDesktop = await framer.agent.getNode({ id: "rtJNTCNFr" }, { pagePath })

function slim(n, depth = 0) {
    if (!n || depth > 7) return n
    const a = n.attributes || {}
    const keep = {
        id: n.id,
        name: n.name,
        type: n.class || n.type,
        component: n.component,
        parent: n.$parentId,
        fill: a.fill,
        height: a.height,
        width: a.width,
        gap: a.gap,
        layout: a.layout,
        stackDirection: a.stackDirection,
        stackAlignment: a.stackAlignment,
        htmlTag: a.htmlTag,
        overflow: a.overflow,
        visible: a.visible,
        text: a.text,
        textStylePreset: a.textStylePreset,
        collection: a["collectionList.collection"] || a.collectionList?.collection,
        repeated: a["collectionList.repeatedDescendantId"],
        stills: {
            images: a.$control__images,
            cover: a.$control__cover,
            still1: a.$control__still1,
            still2: a.$control__still2,
            still3: a.$control__still3,
            still4: a.$control__still4,
            gap: a.$control__gap,
        },
    }
    return {
        ...keep,
        children: (n.children || []).map((c) => slim(c, depth + 1)),
    }
}

const workPage = await framer.agent.serialize(
    { id: "fpoP3kuA4", depth: 2, attributeFilter: ["name", "replicaOf"] },
    { pagePath }
)

const home = await framer.agent.serialize(
    { id: "augiA20Il", depth: 4, attributeFilter: ["name", "component", "replicaOf"] },
    { pagePath: "/" }
)

function findByName(n, names, acc = []) {
    if (names.includes(n.name) || String(n.component || "").includes("jeA2cvO")) {
        acc.push({ id: n.id, name: n.name, component: n.component, parent: n.$parentId })
    }
    for (const c of n.children || []) findByName(c, names, acc)
    return acc
}

const ctx = await framer.agent.getContext({ pagePath })
const styles = ctx?.textStyles || ctx?.textStylePresets || null
const inventorySnippet = JSON.stringify(ctx).slice(0, 500)

console.log(
    JSON.stringify(
        {
            project: info.name,
            coverAttrs: cover?.attributes,
            workDesktopName: workDesktop?.name,
            workPageChildren: (workPage?.children || []).map((c) => ({
                id: c.id,
                name: c.name,
                replicaOf: c.replicaOf || c.attributes?.replicaOf,
            })),
            gallerySlim: slim(gallery?.[0] || gallery),
            homeStills: findByName(home, ["Series Stills", "Gallery", "Lookbook"]),
            inventorySnippet,
            styleKeys: ctx ? Object.keys(ctx) : [],
        },
        null,
        2
    )
)

const info = await framer.getProjectInfo()
if (info.name !== "Fair Platform") throw new Error(info.name)

function walk(node, acc, depth) {
    if (!node || depth > 6) return
    acc.push({
        id: node.id,
        name: node.name,
        type: node.__class || node.type,
        text: typeof node.text === "string" ? node.text.slice(0, 80) : undefined,
        layoutTemplate: node.layoutTemplate,
        overflow: node.overflow,
        stackDirection: node.stackDirection,
        codeOverride: node.codeOverride,
        visible: node.visible,
    })
}

async function serialize(id, depth) {
    const n = await framer.getNode(id)
    if (!n) return { missing: id }
    const out = {
        id,
        name: n.name,
        type: n.__class,
        layoutTemplate: n.layoutTemplate,
        overflow: n.overflow,
        hideScrollbars: n.hideScrollbars,
        stackDirection: n.stackDirection,
        gap: n.gap,
        padding: n.padding,
        width: n.width,
        height: n.height,
        fontSize: n.fontSize,
        text: typeof n.text === "string" ? n.text.slice(0, 120) : undefined,
        textStylePreset: n.textStylePreset,
        link: n.link,
        children: [],
    }
    for (const cid of n.children || []) {
        if (depth >= 4) break
        out.children.push(await serialize(cid, depth + 1))
    }
    return out
}

const pages = await framer.getNodesWithType("WebPageNode")
const pageBrief = []
for (const p of pages || []) {
    pageBrief.push({
        id: p.id,
        name: p.name,
        path: p.path,
        layoutTemplate: p.layoutTemplate,
    })
}

const nav = await serialize("IhgjBMpmC", 0)
const home = await serialize("WQLkyLRf1", 0)
const phone = await serialize("u75vHQkAR", 0)
const tabletList = await serialize("t62LHpSTayAd2lMDSW", 0)
const phoneList = await serialize("u75vHQkARyAd2lMDSW", 0)
const house = await serialize("tVu2ncruf", 0)
const desk = await serialize("J1kd1wjJe", 0)
const four = await serialize("pWw0UM2JG", 0)
const wordmark = await framer.getNode("QhfNwiny9")
const display = await framer.getTextStyle("dPXgkd9PP")
const label = await framer.getTextStyle("BEFvspdZd")

const leftovers = []
const hay = JSON.stringify({
    house,
    desk,
    four,
    nav,
    home,
    pages: pageBrief,
})
for (const needle of ["Glass Hours", "Halden", "lorem", "Lorem", "Quarto", "Shopify", "Fair Platform"]) {
    if (hay.includes(needle)) leftovers.push(needle)
}

console.log(
    JSON.stringify(
        {
            project: info.name,
            pages: pageBrief,
            nav,
            wordmark: wordmark
                ? { name: wordmark.name, text: wordmark.text, fontSize: wordmark.fontSize, padding: wordmark.padding }
                : null,
            display,
            label,
            homeKids: (home.children || []).map((c) => ({ id: c.id, name: c.name, type: c.type })),
            tabletList: {
                name: tabletList.name,
                overflow: tabletList.overflow,
                stackDirection: tabletList.stackDirection,
            },
            phoneList: {
                name: phoneList.name,
                overflow: phoneList.overflow,
                stackDirection: phoneList.stackDirection,
                type: phoneList.type,
            },
            leftovers,
        },
        null,
        2
    )
)

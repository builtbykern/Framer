function textOf(n) {
    const t = n.attributes?.text
    if (typeof t === "string") return t
    if (t && typeof t === "object") return JSON.stringify(t)
    return ""
}

const pages = await framer.agent.serializeNodes({
    ids: ["augiA20Il", "FZFYEKdG1", "eT5aUzOXW", "pTPGQ4L6O", "GPILtKFJP"],
    depth: 0,
})

const cms = await framer.agent.serializeNodes({
    ids: ["t2sbY17Aq"],
    depth: 1,
})

const homeScan = await framer.agent.serializeNodes({
    ids: ["WQLkyLRf1", "t62LHpSTa", "u75vHQkAR", "dKIZmzj_1"],
    depth: 6,
    attributeFilter: ["name", "codeFile", "componentIdentifier", "htmlTag", "alt", "metadata"],
})

function findTypes(nodes, acc = []) {
    for (const n of nodes || []) {
        if (
            n.type === "CodeComponentInstanceNode" ||
            n.type === "CodeComponentNode" ||
            n.attributes?.codeFile
        ) {
            acc.push({ id: n.id, name: n.name, type: n.type, code: n.attributes?.codeFile })
        }
        if (n.children) findTypes(n.children, acc)
    }
    return acc
}

const texts = await framer.agent.serializeNodes({
    ids: [
        "QhfNwiny9",
        "ViBjWFaCI",
        "odgkshwbV",
        "oSHXrizqB",
        "FnQbHIoGD",
        "DZIMTQiKB",
        "BU8_2gg2U",
        "axW_NfbLI",
        "i5CphXhmV",
    ],
    depth: 2,
})

const fs = require("fs")
const path = require("path")
const dir = "/Users/noel/Desktop/Framer/.tmp/vitrine-shots"

const piecePage = await framer.agent.serializeNodes({
    ids: ["FZFYEKdG1"],
    depth: 2,
    attributeFilter: ["name", "width", "height", "path"],
})

const pieceBps = (piecePage[0]?.children || []).map((c) => ({
    id: c.id,
    name: c.name,
    w: c.attributes?.width,
}))

for (const bp of pieceBps) {
    if (!bp.id) continue
    const r = await framer.screenshot(bp.id, { format: "jpeg", scale: 1 })
    const slug = String(bp.name || bp.id).toLowerCase().replace(/\s+/g, "-")
    fs.writeFileSync(path.join(dir, `piece-${slug}.jpg`), r.data)
}

for (const [id, name] of [
    ["tVu2ncruf", "house-desktop.jpg"],
    ["J1kd1wjJe", "desk-desktop.jpg"],
    ["pWw0UM2JG", "404-desktop.jpg"],
]) {
    try {
        const r = await framer.screenshot(id, { format: "jpeg", scale: 1 })
        fs.writeFileSync(path.join(dir, name), r.data)
    } catch (e) {
        fs.writeFileSync(path.join(dir, name + ".err.txt"), String(e))
    }
}

console.log(
    JSON.stringify(
        {
            pages: pages.map((p) => ({
                id: p.id,
                name: p.name,
                path: p.attributes?.path,
                title: p.attributes?.metadata?.title,
                desc: p.attributes?.metadata?.description,
                layout: p.attributes?.layoutTemplate,
            })),
            items: (cms[0]?.children || []).map((it) => ({
                id: it.id,
                title: it.attributes?.title,
                slug: it.attributes?.slug,
                featured: it.attributes?.featured,
                module: it.attributes?.module,
            })),
            codeOnHome: findTypes(homeScan),
            pieceBps,
            texts: texts.map((n) => ({
                id: n.id,
                name: n.name,
                text: textOf(n).slice(0, 400),
                kids: n.children?.map((c) => ({
                    name: c.name,
                    type: c.type,
                    text: textOf(c).slice(0, 200),
                })),
            })),
        },
        null,
        2
    )
)

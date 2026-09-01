const fs = require("fs")
const path = require("path")
const dir = "/Users/noel/Desktop/Framer/.tmp/vitrine-shots"
fs.mkdirSync(dir, { recursive: true })

const info = await framer.getProjectInfo()

const tree = await framer.agent.serializeNodes({
    ids: [
        "augiA20Il",
        "FZFYEKdG1",
        "eT5aUzOXW",
        "pTPGQ4L6O",
        "GPILtKFJP",
        "WQLkyLRf1",
        "t62LHpSTa",
        "u75vHQkAR",
        "dKIZmzj_1",
        "yAd2lMDSW",
        "t62LHpSTayAd2lMDSW",
        "u75vHQkARyAd2lMDSW",
        "OdvHkNWXz",
        "t2sbY17Aq",
        "QhfNwiny9",
        "odgkshwbV",
        "oSHXrizqB",
        "FnQbHIoGD",
        "DZIMTQiKB",
        "BU8_2gg2U",
        "axW_NfbLI",
        "IhgjBMpmC",
    ],
    depth: 3,
    attributeFilter: [
        "name",
        "path",
        "layoutTemplate",
        "$layoutTemplateId",
        "overflow",
        "hideScrollbars",
        "stackDirection",
        "collectionList",
        "text",
        "link",
        "appearEffect",
        "$control__variant",
        "htmlTag",
        "metadata",
    ],
})

function walk(nodes, fn) {
    for (const n of nodes || []) {
        fn(n)
        if (n.children) walk(n.children, fn)
    }
}

const leftovers = []
const needles = [
    "Glass Hours",
    "Halden",
    "Quarto",
    "Mill Ledger",
    "letterpress",
    "lorem",
    "Lorem",
    "ipsum",
]
walk(tree, (n) => {
    const t = n.attributes?.text
    const s = typeof t === "string" ? t : t ? JSON.stringify(t) : ""
    for (const needle of needles) {
        if (s.includes(needle)) leftovers.push({ id: n.id, name: n.name, needle, text: s.slice(0, 180) })
    }
})

const pages = tree.filter((n) => n.type === "WebPageNode")
const homeDesk = tree.find((n) => n.id === "WQLkyLRf1")
const homePhone = tree.find((n) => n.id === "u75vHQkAR")
const homeTablet = tree.find((n) => n.id === "t62LHpSTa")
const list = tree.find((n) => n.id === "yAd2lMDSW")
const phoneList = tree.find((n) => n.id === "u75vHQkARyAd2lMDSW")
const cms = tree.find((n) => n.id === "t2sbY17Aq")
const navComp = tree.find((n) => n.id === "IhgjBMpmC")

for (const [id, name] of [
    ["WQLkyLRf1", "home-desktop.jpg"],
    ["t62LHpSTa", "home-tablet.jpg"],
    ["u75vHQkAR", "home-phone.jpg"],
    ["dKIZmzj_1", "piece-desktop.jpg"],
]) {
    const r = await framer.screenshot(id, { format: "jpeg", scale: 1 })
    fs.writeFileSync(path.join(dir, name), r.data)
}

let review = null
try {
    review = await framer.agent.reviewChanges({ pagePath: "/" })
} catch (e) {
    review = String(e)
}

console.log(
    JSON.stringify(
        {
            project: { id: info.id, name: info.name },
            pages: pages.map((p) => ({
                id: p.id,
                name: p.name,
                path: p.attributes?.path,
                layout: p.attributes?.layoutTemplate ?? null,
                tid: p.attributes?.$layoutTemplateId ?? null,
            })),
            homeKids: homeDesk?.children?.map((c) => ({ name: c.name, type: c.type })),
            tabletKids: homeTablet?.children?.map((c) => ({ name: c.name, type: c.type })),
            phoneKids: homePhone?.children?.map((c) => ({
                name: c.name,
                type: c.type,
                cl: c.attributes?.collectionList?.collection,
                overflow: c.attributes?.overflow,
                hide: c.attributes?.hideScrollbars,
                dir: c.attributes?.stackDirection,
            })),
            list: {
                overflow: list?.attributes?.overflow,
                hide: list?.attributes?.hideScrollbars,
                dir: list?.attributes?.stackDirection,
                collection: list?.attributes?.collectionList?.collection,
            },
            phoneList: {
                overflow: phoneList?.attributes?.overflow,
                hide: phoneList?.attributes?.hideScrollbars,
                dir: phoneList?.attributes?.stackDirection,
                collection: phoneList?.attributes?.collectionList?.collection,
            },
            cmsName: cms?.name,
            cmsItems: cms?.children?.map((it) => it.attributes?.title || it.name),
            navType: navComp?.type,
            leftovers,
            deskLink: tree.find((n) => n.id === "DZIMTQiKB")?.attributes?.link,
            houseBody: tree.find((n) => n.id === "oSHXrizqB")?.attributes?.text,
            wordmark: tree.find((n) => n.id === "QhfNwiny9")?.attributes?.text,
            review,
        },
        null,
        2
    )
)

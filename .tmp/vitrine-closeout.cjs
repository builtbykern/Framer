const fs = require("fs")
const path = require("path")
const dir = "/Users/noel/Desktop/Framer/.tmp/vitrine-shots"
fs.mkdirSync(dir, { recursive: true })

const lint = await framer.agent.applyChanges(
    'SET yAd2lMDSW overflow="auto" hideScrollbars="true"; SET t62LHpSTayAd2lMDSW overflow="auto" hideScrollbars="true"; SET u75vHQkARyAd2lMDSW overflow="auto" hideScrollbars="true"; SET augiA20Il layoutTemplate="null";',
    { pagePath: "/" }
)

const tree = await framer.agent.serializeNodes({
    ids: [
        "augiA20Il",
        "FZFYEKdG1",
        "eT5aUzOXW",
        "pTPGQ4L6O",
        "GPILtKFJP",
        "yAd2lMDSW",
        "u75vHQkAR",
        "WQLkyLRf1",
        "QhfNwiny9",
        "odgkshwbV",
        "FnQbHIoGD",
        "BU8_2gg2U",
        "axW_NfbLI",
        "DZIMTQiKB",
        "OdvHkNWXz",
        "QYwZhiOCq",
        "t2sbY17Aq",
    ],
    depth: 2,
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
    ],
})

for (const [id, name] of [
    ["WQLkyLRf1", "home-desktop.jpg"],
    ["t62LHpSTa", "home-tablet.jpg"],
    ["u75vHQkAR", "home-phone.jpg"],
    ["dKIZmzj_1", "piece-desktop.jpg"],
    ["tVu2ncruf", "house-desktop.jpg"],
    ["J1kd1wjJe", "desk-desktop.jpg"],
    ["pWw0UM2JG", "404-desktop.jpg"],
]) {
    const r = await framer.screenshot(id, { format: "jpeg", scale: 1 })
    fs.writeFileSync(path.join(dir, name), r.data)
}

const vekter = await framer.agent.readProject(
    [
        { type: "screenshot", id: "WQLkyLRf1" },
        { type: "screenshot", id: "t62LHpSTa" },
        { type: "screenshot", id: "u75vHQkAR" },
        { type: "screenshot", id: "dKIZmzj_1" },
    ],
    { pagePath: "/" }
)

const vars = (tree.find((n) => n.id === "OdvHkNWXz") || {}).variables

console.log(
    JSON.stringify(
        {
            lint: {
                message: lint.message,
                errors: lint.linter?.errors,
                warnings: lint.linter?.warnings,
            },
            pages: tree
                .filter((n) => n.type === "WebPageNode")
                .map((p) => ({
                    id: p.id,
                    name: p.name,
                    path: p.attributes?.path,
                    layout: p.attributes?.layoutTemplate ?? null,
                    tid: p.attributes?.$layoutTemplateId ?? null,
                })),
            homeKids: tree
                .find((n) => n.id === "WQLkyLRf1")
                ?.children?.map((c) => ({ name: c.name, type: c.type })),
            phoneKids: tree
                .find((n) => n.id === "u75vHQkAR")
                ?.children?.map((c) => ({
                    name: c.name,
                    type: c.type,
                    cl: c.attributes?.collectionList?.collection,
                    overflow: c.attributes?.overflow,
                    hide: c.attributes?.hideScrollbars,
                    dir: c.attributes?.stackDirection,
                })),
            list: tree.find((n) => n.id === "yAd2lMDSW")?.attributes,
            cms: tree.find((n) => n.id === "t2sbY17Aq")?.name,
            appear: tree.find((n) => n.id === "QYwZhiOCq")?.attributes?.appearEffect,
            titleDefault: vars?.find((v) => v.name === "Title")?.initialValue,
            desk: tree.find((n) => n.id === "DZIMTQiKB")?.attributes?.link,
            vekter,
        },
        null,
        2
    )
)

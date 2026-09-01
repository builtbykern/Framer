const fs = require("fs")
const path = require("path")
const dir = "/Users/noel/Desktop/Framer/.tmp/vitrine-shots"
fs.mkdirSync(dir, { recursive: true })

const controls = await framer.agent.readComponentControls({
    componentIds: ["OdvHkNWXz"],
})

const ring = await framer.agent.queryImages({
    source: "unsplash",
    query: "jewelry ring",
    count: 3,
    orientation: "squarish",
    width: 1400,
})
const R = ring?.results || []
let ringSet = null
if (R[0]?.url) {
    ringSet = await framer.agent.applyChanges(
        `SET lkZBIAg86 $control__cover.src="${R[0].url}" $control__cover.alt="${String(R[0].alt || "ring").replace(/"/g, "")}";`,
        { pagePath: "/" }
    )
}

const pages = await framer.agent.serializeNodes({
    ids: ["augiA20Il", "FZFYEKdG1", "eT5aUzOXW", "pTPGQ4L6O", "GPILtKFJP", "yAd2lMDSW", "u75vHQkAR", "BU8_2gg2U", "axW_NfbLI", "DZIMTQiKB"],
    depth: 1,
    attributeFilter: [
        "name",
        "path",
        "layoutTemplate",
        "overflow",
        "hideScrollbars",
        "collectionList",
        "text",
        "link",
    ],
})

for (const [id, name] of [
    ["WQLkyLRf1", "home-desktop.jpg"],
    ["pWw0UM2JG", "404-desktop.jpg"],
    ["tVu2ncruf", "house-desktop.jpg"],
    ["J1kd1wjJe", "desk-desktop.jpg"],
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
        { type: "screenshot", id: "pWw0UM2JG" },
    ],
    { pagePath: "/" }
)

const lint = await framer.agent.applyChanges(
    'SET yAd2lMDSW overflow="auto" hideScrollbars="true";',
    { pagePath: "/" }
)

console.log(
    JSON.stringify(
        {
            titleDefault: controls?.OdvHkNWXz?.controls?.$control__title?.defaultValue,
            descDefault: controls?.OdvHkNWXz?.controls?.$control__description?.defaultValue,
            rings: R.length,
            ringSet,
            homeLayout: pages[0]?.attributes?.layoutTemplate,
            pages: pages.slice(0, 5).map((p) => ({
                id: p.id,
                name: p.name,
                path: p.attributes?.path,
                layout: p.attributes?.layoutTemplate,
            })),
            list: {
                overflow: pages.find((n) => n.id === "yAd2lMDSW")?.attributes?.overflow,
                hide: pages.find((n) => n.id === "yAd2lMDSW")?.attributes?.hideScrollbars,
                col: pages.find((n) => n.id === "yAd2lMDSW")?.attributes?.collectionList?.collection,
            },
            phoneList: pages
                .find((n) => n.id === "u75vHQkAR")
                ?.children?.map((c) => c.name),
            four04: pages.find((n) => n.id === "BU8_2gg2U"),
            deskLink: pages.find((n) => n.id === "DZIMTQiKB")?.attributes?.link,
            lint: lint.message,
            lintErrors: lint.linter?.errors,
            vekter,
        },
        null,
        2
    )
)

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const cols = await framer.getCollections()
const work = cols.find((c) => c.id === "amTC8pcIG" || c.name === "Work")
const items = await work.getItems()
const featured = items.map((it) => {
    const fd = it.fieldData || {}
    const t = fd.lmTMqy_0B
    const f = fd.LrPrf7_RQ
    return {
        slug: it.slug,
        title: typeof t === "string" ? t : t?.value,
        featured: f === true || f?.value === true,
    }
})
const list = await framer.agent.getNode({ id: "H9TnltXVB" }, { pagePath: "/" })
const plane = await framer.agent.getNode({ id: "RV7bjlgdh" }, { pagePath: "/" })
const fs = require("fs")
const path = require("path")
const r = await framer.screenshot("RV7bjlgdh", { format: "jpeg", scale: 2 })
fs.writeFileSync(
    path.join("/Users/noel/Desktop/Framer/.tmp/halden-shots", "plane-only.jpg"),
    r.data
)
console.log(
    JSON.stringify(
        {
            featured,
            featCount: featured.filter((x) => x.featured).length,
            total: items.length,
            list: {
                name: list?.attributes?.name,
                w: list?.attributes?.width,
                h: list?.attributes?.height,
                visible: list?.attributes?.visible,
            },
            plane: {
                view: plane?.attributes?.$control__view,
                workList: plane?.attributes?.$control__workList,
                w: plane?.attributes?.width,
                h: plane?.attributes?.height,
            },
            planeBytes: r.data.length,
        },
        null,
        2
    )
)

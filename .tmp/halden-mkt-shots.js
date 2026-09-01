const fs = require("fs")
const path = require("path")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const outDir = "/Users/noel/Desktop/Framer/.tmp/halden-mkt-shots"
const workList = await framer.agent.getNode({ id: "xmBenkfAk" }, { pagePath: "/" })
const shots = [
    { id: "nACIEuvcP", file: "404-desktop.png", pagePath: "/404" },
    { id: "h0q8NyaAQ", file: "404-phone.png", pagePath: "/404" },
    { id: "nyI5jW7lA", file: "home-phone.png", pagePath: "/" },
    { id: "BjqrvIntT", file: "home-tablet.png", pagePath: "/" },
    { id: "Tf2mbU7Bv", file: "work-phone.png", pagePath: "/work/:Work" },
    { id: "LSqc1L2WH", file: "work-tablet.png", pagePath: "/work/:Work" },
]
const bytes = {}
for (const s of shots) {
    const r = await framer.screenshot(s.id, { format: "png", scale: 1 })
    fs.writeFileSync(path.join(outDir, s.file), r.data)
    bytes[s.file] = r.data.length
}

console.log(
    JSON.stringify(
        {
            workList: {
                name: workList?.name,
                left: workList?.attributes?.left,
                top: workList?.attributes?.top,
                width: workList?.attributes?.width,
                visible: workList?.attributes?.visible,
                collection: workList?.attributes?.["collectionList.collection"],
                parent: workList?.$parentId,
            },
            bytes,
        },
        null,
        2
    )
)

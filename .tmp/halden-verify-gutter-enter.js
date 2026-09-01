const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)
const files = await framer.getCodeFiles()
const code = await files.find((f) => f.id === "Og5966a").content
const t = await framer.agent.getNode({ id: "BjqrvIntTRV7bjlgdh" }, { pagePath: "/" })
const p = await framer.agent.getNode({ id: "nyI5jW7lARV7bjlgdh" }, { pagePath: "/" })
console.log(
    JSON.stringify(
        {
            project: info.name,
            stillGutterCtrl: code.includes("title: \"Still Gutter\""),
            stillGutterVar: code.includes("--still-gutter"),
            enterCss: code.includes("COLLECTION_ENTER_CSS"),
            noForce: !code.includes("COLLECTION_STILL_FORCE_CSS"),
            ioViewport: code.includes("root: null"),
            tabletSlot: t?.attributes?.["$control__workList.0"],
            tabletView: t?.attributes?.$control__view,
            phoneView: p?.attributes?.$control__view,
        },
        null,
        2
    )
)

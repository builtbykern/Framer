const d = await framer.agent.getNode({ id: "RV7bjlgdh" }, { pagePath: "/" })
const t = await framer.agent.getNode({ id: "BjqrvIntTRV7bjlgdh" }, { pagePath: "/" })
const p = await framer.agent.getNode({ id: "nyI5jW7lARV7bjlgdh" }, { pagePath: "/" })
const stills = await framer.agent.getNode({ id: "yGFlVus2I" }, { pagePath: "/" })
const info = await framer.getProjectInfo()
console.log(
    JSON.stringify(
        {
            project: info.name,
            desktop: {
                view: d?.attributes?.$control__view,
                slot: d?.attributes?.["$control__workList.0"],
            },
            tablet: {
                view: t?.attributes?.$control__view,
                slot: t?.attributes?.["$control__workList.0"],
                height: t?.attributes?.height,
            },
            phone: {
                view: p?.attributes?.$control__view,
                slot: p?.attributes?.["$control__workList.0"],
                height: p?.attributes?.height,
            },
            cover: stills?.attributes?.$control__cover,
        },
        null,
        2
    )
)

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const cover = await framer.agent.getNode({ id: "nt9Gs3MMs" }, { pagePath: "/" })
const title = await framer.agent.getNode({ id: "GAokM9PPJ" }, { pagePath: "/" })
const year = await framer.agent.getNode({ id: "XwtyrQVdF" }, { pagePath: "/" })
const grid = await framer.agent.getNode({ id: "cMyCjMOpL" }, { pagePath: "/" })
const a = (n) => n?.attributes || {}
console.log(
    JSON.stringify(
        {
            cover: {
                position: a(cover).position,
                top: a(cover).top,
                left: a(cover).left,
                width: a(cover).width,
                height: a(cover).height,
                overflow: a(cover).overflow,
            },
            title: {
                overflow: a(title).overflow,
                visible: a(title).visible,
                height: a(title).height,
                fontSize: a(title).fontSize,
            },
            year: {
                width: a(year).width,
                height: a(year).height,
                visible: a(year).visible,
            },
            grid: { height: a(grid).height, visible: a(grid).visible },
        },
        null,
        2
    )
)

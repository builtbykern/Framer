const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const pagePath = "/work/:Work"
const ids = [
    "lgPBjlVA8",
    "GmsqajS3d",
    "DyykSOQwx",
    "w4QuZ0uSJ",
    "UmN1BalYs",
    "oZ3ZTH2de",
    "bOI4aJofa",
]
const report = []
for (const id of ids) {
    const n = await framer.agent.getNode({ id }, { pagePath })
    report.push({
        id,
        name: n?.name,
        appear: n?.attributes?.appearEffect,
        overflow: n?.attributes?.overflow,
        height: n?.attributes?.height,
        fill: n?.attributes?.fill,
    })
}
console.log(JSON.stringify(report, null, 2))

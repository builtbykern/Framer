const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const home = await framer.agent.serializeNodes(
    { ids: ["yGFlVus2I"], depth: 1 },
    { pagePath: "/" }
)

const file = await framer.getCodeFile("jeA2cvO")
const content = typeof file?.content === "string" ? file.content : ""
const markers = {
    unwrapCms: content.includes("cmsImageFromFieldData"),
    stillPaint: content.includes("data-still-paint"),
    hostFrozen: content.includes("hostFrozen"),
    inCollection: content.includes("data-driftplane-mode"),
    len: content.length,
}

console.log(
    JSON.stringify(
        {
            project: info.name,
            homeStills: home,
            markers,
        },
        null,
        2
    )
)

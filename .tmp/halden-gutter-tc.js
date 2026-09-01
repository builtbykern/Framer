const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)
const files = await framer.getCodeFiles()
const drift = files.find((f) => f.id === "Og5966a")
const stills = files.find((f) => f.id === "jeA2cvO")
const driftTc = await drift.typecheck()
console.log(
    JSON.stringify(
        {
            project: info.name,
            driftTc,
            stillsHasCluster:
                typeof stills?.content === "string" &&
                stills.content.includes("collectionMod"),
        },
        null,
        2
    )
)

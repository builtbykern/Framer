const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const files = await framer.getCodeFiles()
const drift = files.find((f) => f.id === "Og5966a")
const stills = files.find((f) => f.id === "jeA2cvO")
const driftContent = typeof drift?.content === "string" ? drift.content : ""
const stillsContent = typeof stills?.content === "string" ? stills.content : ""

console.log(
    JSON.stringify(
        {
            project: info.name,
            drift: {
                unwrap: driftContent.includes("unwrapControlValue"),
                gutterPx: driftContent.includes("column-gap: ${collectionGap}px"),
                clusterStart: driftContent.includes("justify-items: stretch"),
                len: driftContent.length,
            },
            stills: {
                collectionMod: stillsContent.includes("collectionMod !== \"cluster\""),
                len: stillsContent.length,
            },
        },
        null,
        2
    )
)

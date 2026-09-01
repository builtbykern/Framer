const files = await framer.getCodeFiles()
const series = files.find((f) => f.id === "jeA2cvO")
const versions = await series.getVersions()
console.log(
    JSON.stringify(
        {
            currentBytes: (await series.content).length,
            versions: (versions || []).slice(0, 8).map((v) => ({
                keys: Object.keys(v || {}),
                id: v.id || v.versionId,
                created: v.createdAt || v.date,
                bytes: typeof v.content === "string" ? v.content.length : undefined,
            })),
        },
        null,
        2
    )
)

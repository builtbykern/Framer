const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)
const files = await framer.getCodeFiles()
console.log(
    JSON.stringify(
        {
            project: info.name,
            count: files.length,
            files: files.map((f) => ({ id: f.id, name: f.name })),
        },
        null,
        2
    )
)

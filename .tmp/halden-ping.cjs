const info = await framer.getProjectInfo()
const files = await framer.getCodeFiles()
console.log(
    JSON.stringify({
        project: info.name,
        files: files.map((f) => f.name),
    })
)

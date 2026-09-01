const info = await framer.getProjectInfo()
const keys = Object.keys(framer)
    .concat(Object.keys(framer.agent || {}))
    .filter((k) => /code|file|File|plugin/i.test(k))
const files = await framer.getCodeFiles()
let byName = null
try {
    byName = await framer.getCodeFile("Series_Stills.tsx")
} catch (error) {
    byName = String(error)
}
console.log(
    JSON.stringify(
        {
            project: info.name,
            keys,
            fileCount: files.length,
            byName: byName && typeof byName === "object" ? { id: byName.id, name: byName.name } : byName,
        },
        null,
        2
    )
)

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

let pages = 0
try {
    const list = await framer.getPages()
    pages = Array.isArray(list) ? list.length : 0
} catch (error) {
    pages = String(error)
}

const filesAfterPages = await framer.getCodeFiles()

let created = null
try {
    const existing = await framer.getCodeFile("Series_Stills.tsx")
    created = existing
        ? { via: "get", id: existing.id, name: existing.name }
        : { via: "missing" }
} catch (error) {
    created = { via: "error", error: String(error) }
}

console.log(
    JSON.stringify(
        {
            project: info.name,
            pages,
            fileCount: filesAfterPages.length,
            names: filesAfterPages.map((f) => f.name),
            created,
        },
        null,
        2
    )
)

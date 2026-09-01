const info = await framer.getProjectInfo()
let reconnectResult = null
if (typeof framer.reconnect === "function") {
    try {
        reconnectResult = await framer.reconnect()
    } catch (error) {
        reconnectResult = String(error)
    }
}
const files = await framer.getCodeFiles()
const stills = await framer.getCodeFile("Series_Stills.tsx")
console.log(
    JSON.stringify(
        {
            project: info.name,
            reconnectResult: reconnectResult && typeof reconnectResult === "object" ? "ok" : reconnectResult,
            fileCount: files.length,
            fileNames: files.map((f) => f.name),
            stillsId: stills?.id ?? null,
        },
        null,
        2
    )
)

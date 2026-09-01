const info = await framer.getProjectInfo()
console.log("info", JSON.stringify(info, null, 2).slice(0, 2000))

let preview = null
try {
    preview = await framer.agent.publish({ action: "preview" })
} catch (e) {
    preview = { error: String(e?.message || e) }
}
console.log("preview", JSON.stringify(preview, null, 2).slice(0, 4000))

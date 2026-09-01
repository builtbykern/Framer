const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)
try {
    const file = await framer.createCodeFile(
        "Halden_Probe.tsx",
        "export default function Halden_Probe(){return <div style={{position:'relative'}} />}"
    )
    console.log(JSON.stringify({ ok: true, id: file.id, name: file.name }))
} catch (e) {
    console.log(JSON.stringify({ ok: false, error: String(e) }))
}

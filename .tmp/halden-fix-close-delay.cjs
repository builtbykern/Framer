const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const applied = await framer.agent.applyChanges(
    'SET lHV5aHgaZGz9TsJWVA onTap.0.action="SET_VARIANT" onTap.0.controls.variant="QZInDjV1k" onTap.0.delay="0s" onTap.1.action="SET_VARIANT" onTap.1.controls.variant="QZInDjV1k" onTap.1.delay="0s";'
)

console.log(JSON.stringify({ ok: true, applied }, null, 2))

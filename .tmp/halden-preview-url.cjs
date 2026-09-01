const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const preview = await framer.agent.publish({ action: "preview" })
console.log(JSON.stringify(preview, null, 2))

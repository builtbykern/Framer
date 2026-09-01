const preview = await framer.agent.publish({ action: "preview" })
console.log(JSON.stringify(preview, null, 2).slice(0, 8000))

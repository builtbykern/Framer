const fs = require("fs")
const pagePath = "/contact"

const proj = await framer.getProjectInfo()
if (proj.name !== "Arbour") throw new Error("wrong " + proj.name)

const file = await framer.getCodeFile("Arbour_BlendStyle.tsx")
await file.setFileContent(fs.readFileSync(".tmp/Arbour_BlendStyle.tsx", "utf8"))

// Kill stroke halo; keep dense layout; injector can stay for blend=normal no-op or hide it
const dsl = [
  `SET e5xcrxKTw $control__blendMode="normal" $control__halo=false visible=true`,
  `SET qjv2S9Wpae5xcrxKTw $control__blendMode="normal" $control__halo=false visible=true`,
  `SET jEM0wBo2ve5xcrxKTw visible=false $control__halo=false`,
].join("; ")

const r = await framer.agent.applyChanges(dsl, { pagePath })
console.log(JSON.stringify({ msg: r.message, errors: r.errors }))

const res = await framer.publish()
console.log(JSON.stringify({ id: res.deployment?.id, status: res.deployment?.status }))

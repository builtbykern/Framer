const fs = require("fs")
const pagePath = "/contact"

const proj = await framer.getProjectInfo()
if (proj.name !== "Arbour") throw new Error("wrong " + proj.name)

const code = fs.readFileSync(".tmp/Arbour_BlendStyle.tsx", "utf8")
const file = await framer.getCodeFile("Arbour_BlendStyle.tsx")
await file.setFileContent(code)
const refreshed = (await framer.getCodeFiles()).find((f) => f.id === file.id)
console.log("typeErrors", await refreshed.typecheck?.({ strict: true }))

// Keep H1 mostly on Paper: wider wash + tighter headline measure
const dsl = [
  `SET e5xcrxKTw $control__blendMode="normal" $control__halo=true visible=true`,
  `SET qjv2S9Wpae5xcrxKTw $control__blendMode="normal" $control__halo=true visible=true`,
  `SET jEM0wBo2ve5xcrxKTw visible=false $control__halo=false`,
  `SET smzXd5qNf width="68%"`,
  `SET qjv2S9WpasmzXd5qNf width="64%"`,
  `SET R80e8PwNu textColor="var(--token-e2f9a9eb-668a-4021-80d9-b04413b5f392)" maxWidth="720px"`,
  `SET qjv2S9WpaR80e8PwNu maxWidth="640px"`,
  `SET jEM0wBo2vR80e8PwNu maxWidth="100%"`,
].join("; ")

const r = await framer.agent.applyChanges(dsl, { pagePath })
console.log(JSON.stringify({ msg: r.message, errors: r.errors, warnings: (r.warnings || []).slice?.(0, 5) || r.warnings }))

const res = await framer.publish()
console.log(JSON.stringify({ id: res.deployment?.id, status: res.deployment?.status }))

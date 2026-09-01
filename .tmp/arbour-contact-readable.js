const fs = require("fs")
const pagePath = "/contact"

const proj = await framer.getProjectInfo()
if (proj.name !== "Arbour") throw new Error("wrong " + proj.name)

const code = fs.readFileSync(".tmp/Arbour_BlendStyle.tsx", "utf8")
const file = await framer.getCodeFile("Arbour_BlendStyle.tsx")
await file.setFileContent(code)
const refreshed = (await framer.getCodeFiles()).find((f) => f.id === file.id)
const typeErrors = await refreshed.typecheck?.({ strict: true })
console.log("typeErrors", typeErrors)

const dsl = [
  `SET e5xcrxKTw $control__blendMode="normal" $control__halo=true $control__targetName="H1 Blend Wrap" visible=true`,
  `SET qjv2S9Wpae5xcrxKTw $control__blendMode="normal" $control__halo=true visible=true`,
  `SET jEM0wBo2ve5xcrxKTw visible=false $control__blendMode="normal"`,
  `SET smzXd5qNf width="46%"`,
  `SET qjv2S9WpasmzXd5qNf width="44%"`,
  `SET R80e8PwNu textColor="var(--token-e2f9a9eb-668a-4021-80d9-b04413b5f392)" maxWidth="920px"`,
].join("; ")

const r = await framer.agent.applyChanges(dsl, { pagePath })
console.log(JSON.stringify({ msg: r.message, errors: r.errors }))

const res = await framer.publish()
console.log(JSON.stringify({ id: res.deployment?.id, status: res.deployment?.status }))

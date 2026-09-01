const fs = require("fs")
const pagePath = "/contact"

const proj = await framer.getProjectInfo()
if (proj.name !== "Arbour") throw new Error("wrong " + proj.name)

const local = fs.readFileSync(".tmp/Arbour_BlendStyle.tsx", "utf8")
const file = await framer.getCodeFile("Arbour_BlendStyle.tsx")
await file.setFileContent(local)
console.log("typeErrors", await file.typecheck?.({ strict: true }))

// Restore dense cinema: narrow wash + wide H1; halo keeps contrast on overlap
const dsl = [
  `SET smzXd5qNf width="42%"`,
  `SET qjv2S9WpasmzXd5qNf width="40%"`,
  `SET R80e8PwNu maxWidth="1040px" textColor="var(--token-e2f9a9eb-668a-4021-80d9-b04413b5f392)"`,
  `SET qjv2S9WpaR80e8PwNu maxWidth="860px"`,
  `SET e5xcrxKTw $control__blendMode="normal" $control__halo=true visible=true`,
  `SET qjv2S9Wpae5xcrxKTw $control__blendMode="normal" $control__halo=true visible=true`,
  `SET jEM0wBo2ve5xcrxKTw visible=false $control__halo=false`,
].join("; ")

const r = await framer.agent.applyChanges(dsl, { pagePath })
console.log(JSON.stringify({ msg: r.message, errors: r.errors }))

const res = await framer.publish()
console.log(JSON.stringify({ id: res.deployment?.id, status: res.deployment?.status }))

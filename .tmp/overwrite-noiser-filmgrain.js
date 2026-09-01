const fs = require("fs")

const code = fs.readFileSync(
  "/Users/noel/Desktop/Framer/.tmp/BuiltByKern_Noiser.tsx",
  "utf8"
)

const file = await framer.getCodeFile("BuiltByKern_Noiser.tsx")
const updated = await file.setFileContent(code)
const errors = await updated.typecheck()
console.log("typecheck", errors)
console.log(
  "exports",
  updated.exports?.map((e) => ({ name: e.name, id: e.componentId || e.id }))
)

const pagePath = "/"
const ids = ["J2vkzxhLh", "U3TeNUVXvJ2vkzxhLh", "pmAxXUJ0oJ2vkzxhLh"]

await framer.agent.applyChanges(
  `
SET J2vkzxhLh name="Film Grain" zIndex="1" pointerEvents="none" $control__grainStyle="soft" $control__tone="ink" $control__ink="#2c2a24" $control__strength="0.18" $control__scale="1.35" $control__detail="2" $control__blendMode="soft-light" $control__motion="true" $control__rate="14";
SET U3TeNUVXvJ2vkzxhLh name="Film Grain" zIndex="1" pointerEvents="none" $control__grainStyle="soft" $control__tone="ink" $control__ink="#2c2a24" $control__strength="0.18" $control__scale="1.35" $control__detail="2" $control__blendMode="soft-light" $control__motion="true" $control__rate="14";
SET pmAxXUJ0oJ2vkzxhLh name="Film Grain" zIndex="1" pointerEvents="none" $control__grainStyle="soft" $control__tone="ink" $control__ink="#2c2a24" $control__strength="0.18" $control__scale="1.35" $control__detail="2" $control__blendMode="soft-light" $control__motion="true" $control__rate="14";
`,
  { pagePath }
)

for (const id of ids) {
  const s = await framer.agent.serialize({ id, depth: 0 }, { pagePath })
  const a = s.attributes || {}
  const controls = Object.fromEntries(
    Object.entries(a).filter(([k]) => k.startsWith("$control__"))
  )
  console.log(
    JSON.stringify({
      id,
      mq: s.$mediaQuery?.name,
      name: s.name,
      d: s.$componentDisplayName,
      controls,
      z: a.zIndex,
      pe: a.pointerEvents,
    })
  )
}

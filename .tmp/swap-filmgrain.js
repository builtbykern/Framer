const pagePath = "/"

const n = await framer.getNode("pmAxXUJ0oJ2vkzxhLh")
console.log("before", {
  name: n?.name,
  ci: n?.componentIdentifier,
  display: n?.$componentDisplayName,
})

// Replace Noiser with Film Grain on Desktop (and check other breakpoints via serialize)
await framer.agent.applyChanges(
  `
DEL pmAxXUJ0oJ2vkzxhLh;
+ComponentInstanceNode filmGrainHome parent="augiA20Il" position="0" component="codeFile/kmpDjW2:default";
SET filmGrainHome name="Film Grain" position="fixed" left="0px" top="0px" right="0px" width="100%" height="100vh" zIndex="1" pointerEvents="none" $control__grainStyle="soft" $control__tone="ink" $control__ink="#2c2a24" $control__strength="0.18" $control__scale="1.35" $control__detail="2" $control__blendMode="soft-light" $control__motion="true" $control__rate="14";
`,
  { pagePath }
)

const nodes = await framer.agent.getDescendantsOfTypes(
  { id: "augiA20Il", types: ["ComponentInstanceNode"] },
  { pagePath }
)
const grain = (nodes || []).filter((x) =>
  /Film|Grain|Noiser/i.test(`${x.name} ${x.$componentDisplayName}`)
)
console.log(
  "after",
  grain.map((x) => ({
    id: x.id,
    name: x.name,
    d: x.$componentDisplayName,
    ci: x.componentIdentifier,
  }))
)

// Overwrite old Noiser with a stub comment? Better: replace content with Film Grain re-export isn't allowed.
// Replace Noiser file content with same Film Grain code under BuiltByKern_Noiser name so orphans still look new,
// then leave FilmGrain as canonical.
const fs = require("fs")
let code = fs.readFileSync(
  "/Users/noel/Desktop/Framer/.tmp/BuiltByKern_FilmGrain.tsx",
  "utf8"
)
code = code
  .replace(/BuiltByKern_FilmGrain/g, "BuiltByKern_Noiser")
  .replace(
    'BuiltByKern_Noiser.displayName = "Film Grain"',
    'BuiltByKern_Noiser.displayName = "Film Grain"'
  )
  .replace(
    "BuiltByKern — editorial film-grain overlay (canvas pixel grain).",
    "BuiltByKern — Film Grain (legacy filename BuiltByKern_Noiser; prefer BuiltByKern_FilmGrain)."
  )

const noiser = await framer.getCodeFile("BuiltByKern_Noiser.tsx")
const updated = await noiser.setFileContent(code)
const errors = await updated.typecheck()
console.log("noiser overwritten typecheck", errors)
console.log(
  "noiser exports",
  updated.exports?.map((e) => ({ name: e.name, id: e.componentId || e.id }))
)

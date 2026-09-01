const fs = require("fs")
const code = fs.readFileSync(
  "/Users/noel/Desktop/Framer/.tmp/Arbour_TerritoryRail_restore.tsx",
  "utf8"
)

// 1) Restore code file
let file = await framer.getCodeFile("Arbour_TerritoryRail.tsx")
if (file) {
  file = await file.setFileContent(code)
} else {
  file = await framer.createCodeFile("Arbour_TerritoryRail.tsx", code)
}
const refreshed =
  (await framer.getCodeFiles()).find((f) => f.id === file.id) || file
let typeErrors = null
try {
  typeErrors = await refreshed.typecheck?.({ strict: true })
} catch (e) {
  typeErrors = String(e)
}
const exportId =
  refreshed.exports?.find((e) => e.type === "component" || e.name)?.id ||
  refreshed.exports?.[0]?.id ||
  `codeFile/${refreshed.id}:default`

const componentRef =
  typeof exportId === "string" && exportId.startsWith("codeFile/")
    ? exportId
    : `codeFile/${refreshed.id}:default`

console.log(
  JSON.stringify(
    {
      step: "create",
      fileId: refreshed.id,
      name: refreshed.name,
      exports: refreshed.exports,
      componentRef,
      typeErrors,
      lines: code.split("\n").length,
    },
    null,
    2
  )
)

// 2) Re-link TerritoryRail instances on Home (primary + ensure component)
const railIds = ["uGXrCjuAT", "U3TeNUVXvuGXrCjuAT", "pmAxXUJ0ouGXrCjuAT"]
const railDsl = railIds
  .map((id) => `SET ${id} component="${componentRef}"`)
  .join("; ")
const railRes = await framer.agent.applyChanges(railDsl, { pagePath: "/" })
console.log(JSON.stringify({ step: "relink-rail", railDsl, railRes }, null, 2))

// 3) Replace Scroll Blur → ProgressiveBlur on Desktop/Tablet/Phone
// Delete externals, create owned ProgressiveBlur with similar chrome placement
const blurSwap = `
DELETE AorZcTogz;
DELETE U3TeNUVXvAorZcTogz;
DELETE pmAxXUJ0oAorZcTogz;
+ComponentInstanceNode homeBlurD parent="WQLkyLRf1" component="codeFile/fOrMtU2:default";
SET homeBlurD name="Arbour_ProgressiveBlur" $control__position="bottom" $control__coverage=100 $control__strength=2 $control__divCount=4 $control__exponential=true $control__curve="linear" $control__opacity=1 position="fixed" bottom="0px" left="null" right="null" top="null" centerAnchorX="50%" centerAnchorY="95.5%" width="100%" height="72px" zIndex="3";
+ComponentInstanceNode homeBlurT parent="U3TeNUVXv" component="codeFile/fOrMtU2:default";
SET homeBlurT name="Arbour_ProgressiveBlur" $control__position="bottom" $control__coverage=100 $control__strength=2 $control__divCount=4 $control__exponential=true $control__curve="linear" $control__opacity=1 position="fixed" bottom="0px" left="null" right="null" top="null" centerAnchorX="50%" centerAnchorY="95.5%" width="100%" height="72px" zIndex="3";
+ComponentInstanceNode homeBlurP parent="pmAxXUJ0o" component="codeFile/fOrMtU2:default";
SET homeBlurP name="Arbour_ProgressiveBlur" $control__position="bottom" $control__coverage=100 $control__strength=2 $control__divCount=4 $control__exponential=true $control__curve="linear" $control__opacity=1 position="fixed" bottom="0px" left="null" right="null" top="null" centerAnchorX="50%" centerAnchorY="95.5%" width="100%" height="72px" zIndex="3";
`
const blurRes = await framer.agent.applyChanges(blurSwap, { pagePath: "/" })
console.log(JSON.stringify({ step: "blur-swap", blurRes }, null, 2))

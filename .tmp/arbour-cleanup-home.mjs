// Cleanup: DEL external TerritoryRail + Scroll Blur; keep owned instances.
// Push TerritoryRail defaults tuned to Home Desktop.

const code = ${JSON.stringify(require("fs").readFileSync("/tmp/Arbour_TerritoryRail_restore.tsx", "utf8"))}

let file = await framer.getCodeFile("Arbour_TerritoryRail.tsx")
file = await file.setFileContent(code)
console.log(JSON.stringify({ step: "push-defaults", fileId: file.id }))

const cleanup = `
DEL uGXrCjuAT;
DEL AorZcTogz;
SET WwRpRyoiD name="Arbour_TerritoryRail" position="relative" width="1fr" height="auto";
SET PaGRz8lMz name="Arbour_ProgressiveBlur" $control__position="bottom" $control__coverage=100 $control__strength=2 $control__divCount=4 $control__exponential=true $control__curve="linear" $control__opacity=1 position="fixed" bottom="0px" left="null" right="null" top="null" centerAnchorX="50%" centerAnchorY="95.5%" width="100%" height="72px" zIndex="3";
`
const res = await framer.agent.applyChanges(cleanup, { pagePath: "/" })
console.log(JSON.stringify({ step: "cleanup", res }, null, 2))

const parent = await framer.agent.serialize({ id: "u7ILl18T3", depth: 2 }, {})
const kids = (parent.children || []).map((c) => ({
    id: c.id,
    component: c.component,
    display: c.$componentDisplayName,
}))

const checks = {}
for (const id of [
    "uGXrCjuAT",
    "WwRpRyoiD",
    "U3TeNUVXvWwRpRyoiD",
    "pmAxXUJ0oWwRpRyoiD",
    "AorZcTogz",
    "U3TeNUVXvAorZcTogz",
    "pmAxXUJ0oAorZcTogz",
    "PaGRz8lMz",
    "U3TeNUVXvPaGRz8lMz",
    "pmAxXUJ0oPaGRz8lMz",
]) {
    try {
        const n = await framer.agent.serialize({ id, depth: 0 }, {})
        checks[id] = n
            ? {
                  id: n.id,
                  component: n.component,
                  display: n.$componentDisplayName,
                  parent: n.$parentId,
              }
            : { missing: true }
    } catch (e) {
        checks[id] = { missing: true, error: String(e) }
    }
}

console.log(JSON.stringify({ step: "verify", kids, checks }, null, 2))

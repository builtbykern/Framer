// Restore TerritoryRail ownership + replace Scroll Blur → ProgressiveBlur on Home.
// Primary-only DELETE/ADD so breakpoint replicas cascade.

const RAIL = "codeFile/il4DSn9:default"
const BLUR = "codeFile/fOrMtU2:default"

// 1) TerritoryRail: delete primary external, recreate owned under same parent
const railSwap = `
DELETE uGXrCjuAT;
+ComponentInstanceNode homeRail parent="u7ILl18T3" component="${RAIL}";
SET homeRail name="Arbour_TerritoryRail" position="relative" width="1fr" height="auto" $control__content.itemLimit=12 $control__content.linkBase="/neighbourhoods" $control__content.viewLabel="VIEW →" $control__content.ariaLabel="Territories" $control__layout.imageRatio=1.74 $control__layout.stripWidth=160 $control__layout.stripHeight=240 $control__layout.stripLift=26 $control__layout.stripInactiveOpacity=0.4 $control__layout.stripGap=0 $control__layout.stripPosition="bottom" $control__layout.imagePadding=0 $control__layout.textAlign="center" $control__layout.contentPadding=40 $control__layout.contentPosition="top" $control__layout.topBandAlign="inline" $control__layout.showEditorialIndex=false $control__layout.showViewLink=false $control__layout.responsiveThumbSize=64 $control__layout.responsiveThumbMinSize=56 $control__layout.responsiveThumbGap=8 $control__typography.titleUppercase=true $control__atmosphere.showGrain=true $control__atmosphere.showVignette=false $control__atmosphere.showFrame=true $control__atmosphere.showBlur=true $control__atmosphere.showTopBlur=true $control__atmosphere.blurStrength=10 $control__atmosphere.grainOpacity=0.33 $control__colors.titleColor="rgb(252, 250, 244)" $control__colors.metaColor="rgba(252, 250, 244, 0.72)" $control__colors.accentColor="rgb(214, 224, 74)" $control__colors.stageBackground="rgb(21, 43, 30)" $control__colors.scrimColor="rgba(21, 43, 30, 0.7)" $control__colors.scrimOpacity=0.72 $control__colors.showIndex=true $control__motion.slideInterval=10 $control__motion.pauseOnHover=true $control__motion.springStiffness=90 $control__motion.springDamping=22;
`

const railRes = await framer.agent.applyChanges(railSwap, { pagePath: "/" })
console.log(JSON.stringify({ step: "rail-swap", railRes }, null, 2))

// Find new primary rail id
const parent = await framer.agent.serialize({ id: "u7ILl18T3", depth: 2 }, {})
const newRail = (parent.children || []).find(
    (c) => c.type === "ComponentInstanceNode"
)
console.log(
    JSON.stringify(
        {
            step: "rail-verify",
            newRail: newRail && {
                id: newRail.id,
                component: newRail.component,
                name: newRail.$componentDisplayName || newRail.name,
            },
            kids: (parent.children || []).map((c) => ({
                id: c.id,
                component: c.component,
            })),
        },
        null,
        2
    )
)

// Tablet / Phone overrides (if replicas exist)
if (newRail?.id) {
    const tabletId = `U3TeNUVXv${newRail.id}`
    const phoneId = `pmAxXUJ0o${newRail.id}`
    const overrideDsl = `
SET ${tabletId} $control__layout.stripWidth=100 $control__layout.stripHeight=260 $control__layout.stripLift=40 $control__layout.stripInactiveOpacity=0.42 $control__atmosphere.showVignette=true;
SET ${phoneId} width="100%" $control__layout.stripWidth=100 $control__layout.stripHeight=260 $control__layout.stripLift=40 $control__layout.stripInactiveOpacity=0.42 $control__layout.showEditorialIndex=true $control__layout.responsiveThumbSize=80 $control__layout.responsiveThumbMinSize=64 $control__atmosphere.showVignette=false $control__atmosphere.blurStrength=28 $control__atmosphere.grainOpacity=0.5;
`
    const ovRes = await framer.agent.applyChanges(overrideDsl, { pagePath: "/" })
    console.log(JSON.stringify({ step: "rail-bp-overrides", overrideDsl, ovRes }, null, 2))
}

// 2) Scroll Blur → ProgressiveBlur (primary only; replicas cascade)
const blurSwap = `
DELETE AorZcTogz;
+ComponentInstanceNode homeBlur parent="WQLkyLRf1" component="${BLUR}";
SET homeBlur name="Arbour_ProgressiveBlur" $control__position="bottom" $control__coverage=100 $control__strength=2 $control__divCount=4 $control__exponential=true $control__curve="linear" $control__opacity=1 position="fixed" bottom="0px" left="null" right="null" top="null" centerAnchorX="50%" centerAnchorY="95.5%" width="100%" height="72px" zIndex="3";
`
const blurRes = await framer.agent.applyChanges(blurSwap, { pagePath: "/" })
console.log(JSON.stringify({ step: "blur-swap", blurRes }, null, 2))

// Verify ownership
const checkIds = []
if (newRail?.id) {
    checkIds.push(newRail.id, `U3TeNUVXv${newRail.id}`, `pmAxXUJ0o${newRail.id}`)
}
const blurCheck = ["AorZcTogz", "U3TeNUVXvAorZcTogz", "pmAxXUJ0oAorZcTogz"]
const after = {}
for (const id of [...checkIds, ...blurCheck]) {
    try {
        after[id] = await framer.agent.serialize({ id, depth: 0 }, {})
    } catch (e) {
        after[id] = { missing: true, error: String(e) }
    }
}

// Find ProgressiveBlur instances on Home
const typed = await framer.agent.getNodesOfTypes({
    types: ["ComponentInstanceNode"],
})
const homeBlurNodes = (typed || []).filter((n) => {
    const c = n.component || n.componentIdentifier || ""
    const name = n.name || n.$componentDisplayName || ""
    return (
        String(c).includes("fOrMtU2") ||
        String(name).includes("ProgressiveBlur") ||
        String(c).includes("eITABUpGF0ytPyxYWYqu")
    )
})
console.log(
    JSON.stringify(
        {
            step: "final-verify",
            after: Object.fromEntries(
                Object.entries(after).map(([id, n]) => [
                    id,
                    n && {
                        id: n.id,
                        component: n.component,
                        missing: n.missing,
                        display: n.$componentDisplayName,
                    },
                ])
            ),
            homeBlurNodes: homeBlurNodes.slice(0, 20),
        },
        null,
        2
    )
)

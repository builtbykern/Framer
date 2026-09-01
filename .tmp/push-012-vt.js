const fs = require("node:fs")

async function push(name, path) {
    const code = fs.readFileSync(path, "utf8")
    const file = await framer.getCodeFile(name)
    const updated = await file.setFileContent(code)
    const errors = await updated.typecheck({ strict: true })
    return { name, ok: errors.length === 0, errors }
}

const results = []
results.push(
    await push(
        "Arbour_PropertyCard.tsx",
        "/Users/noel/Desktop/Framer/.tmp/Arbour_PropertyCard.tsx"
    )
)
results.push(
    await push(
        "Arbour_InertiaFrame.tsx",
        "/Users/noel/Desktop/Framer/.tmp/Arbour_InertiaFrame.tsx"
    )
)

const pagePath = "/properties-2/:Properties"
const dsl = `
SET TanN7b8Lp appearEffect.trigger="onMount" appearEffect.replay="false" appearEffect.threshold="0" appearEffect.enter.opacity="1" appearEffect.enter.scale="1" appearEffect.enter.x="0" appearEffect.enter.y="0" appearEffect.enter.transition="tween 0.23,1,0.32,1 0s 0s";
SET IQmBTrFpbTanN7b8Lp appearEffect.trigger="onMount" appearEffect.replay="false" appearEffect.threshold="0" appearEffect.enter.opacity="1" appearEffect.enter.scale="1" appearEffect.enter.x="0" appearEffect.enter.y="0" appearEffect.enter.transition="tween 0.23,1,0.32,1 0s 0s";
SET MrTKJzwELTanN7b8Lp appearEffect.trigger="onMount" appearEffect.replay="false" appearEffect.threshold="0" appearEffect.enter.opacity="1" appearEffect.enter.scale="1" appearEffect.enter.x="0" appearEffect.enter.y="0" appearEffect.enter.transition="tween 0.23,1,0.32,1 0s 0s";
`
const appear = await framer.agent.applyChanges(dsl, { pagePath })

console.log(
    JSON.stringify(
        {
            push: results,
            appear,
            hasVtCard: fs
                .readFileSync(
                    "/Users/noel/Desktop/Framer/.tmp/Arbour_PropertyCard.tsx",
                    "utf8"
                )
                .includes("arbour-property-hero"),
            hasVtInertia: fs
                .readFileSync(
                    "/Users/noel/Desktop/Framer/.tmp/Arbour_InertiaFrame.tsx",
                    "utf8"
                )
                .includes("arbour-property-hero"),
        },
        null,
        2
    )
)

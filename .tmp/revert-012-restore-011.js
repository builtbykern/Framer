const fs = require("node:fs")

async function push(name, path) {
    const code = fs.readFileSync(path, "utf8")
    if (code.includes("arbour-property-hero")) {
        throw new Error(`${name} still contains VT`)
    }
    const file = await framer.getCodeFile(name)
    const updated = await file.setFileContent(code)
    const errors = await updated.typecheck({ strict: true })
    return { name, ok: errors.length === 0, errors }
}

const results = [
    await push(
        "Arbour_PropertyCard.tsx",
        "/Users/noel/Desktop/Framer/.tmp/Arbour_PropertyCard.tsx"
    ),
    await push(
        "Arbour_InertiaFrame.tsx",
        "/Users/noel/Desktop/Framer/.tmp/Arbour_InertiaFrame.tsx"
    ),
]

const pagePath = "/properties-2/:Properties"

/** Restore fluid hero settle (011) — no View Transitions. */
const dsl = `
SET TanN7b8Lp appearEffect.trigger="onMount" appearEffect.replay="false" appearEffect.threshold="0" appearEffect.enter.opacity="0" appearEffect.enter.scale="1.06" appearEffect.enter.x="0" appearEffect.enter.y="0" appearEffect.enter.transition="tween 0.23,1,0.32,1 0.45s 0s";
SET IQmBTrFpbTanN7b8Lp appearEffect.trigger="onMount" appearEffect.replay="false" appearEffect.threshold="0" appearEffect.enter.opacity="0" appearEffect.enter.scale="1.06" appearEffect.enter.x="0" appearEffect.enter.y="0" appearEffect.enter.transition="tween 0.23,1,0.32,1 0.45s 0s";
SET MrTKJzwELTanN7b8Lp appearEffect.trigger="onMount" appearEffect.replay="false" appearEffect.threshold="0" appearEffect.enter.opacity="0" appearEffect.enter.scale="1.06" appearEffect.enter.x="0" appearEffect.enter.y="0" appearEffect.enter.transition="tween 0.23,1,0.32,1 0.45s 0s";
SET ubrig7P0R appearEffect.trigger="onMount" appearEffect.replay="false" appearEffect.threshold="0" appearEffect.enter.opacity="0" appearEffect.enter.scale="1" appearEffect.enter.x="0" appearEffect.enter.y="16" appearEffect.enter.transition="tween 0.23,1,0.32,1 0.4s 0.08s";
SET IQmBTrFpbubrig7P0R appearEffect.trigger="onMount" appearEffect.replay="false" appearEffect.threshold="0" appearEffect.enter.opacity="0" appearEffect.enter.scale="1" appearEffect.enter.x="0" appearEffect.enter.y="16" appearEffect.enter.transition="tween 0.23,1,0.32,1 0.4s 0.08s";
SET MrTKJzwELubrig7P0R appearEffect.trigger="onMount" appearEffect.replay="false" appearEffect.threshold="0" appearEffect.enter.opacity="0" appearEffect.enter.scale="1" appearEffect.enter.x="0" appearEffect.enter.y="16" appearEffect.enter.transition="tween 0.23,1,0.32,1 0.4s 0.08s";
`

const appear = await framer.agent.applyChanges(dsl, { pagePath })

const hero = await framer.agent.serialize(
    { id: "TanN7b8Lp", depth: 0, attributeFilter: ["appearEffect"] },
    { pagePath }
)

console.log(
    JSON.stringify(
        {
            results,
            appear,
            hero: hero.attributes?.appearEffect,
            cardClean: !(await framer.getCodeFile("Arbour_PropertyCard.tsx"))
                .content.includes("arbour-property-hero"),
            inertiaClean: !(await framer.getCodeFile("Arbour_InertiaFrame.tsx"))
                .content.includes("arbour-property-hero"),
        },
        null,
        2
    )
)

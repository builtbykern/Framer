const desk0 = await framer.agent.getNode({ id: "WQLkyLRf1" }, { pagePath: "/" })
console.log("before", desk0?.attributes?.codeOverride)

const tries = []
const dsls = [
    'SET WQLkyLRf1 codeOverride="";',
    "SET WQLkyLRf1 codeOverride=null;",
    "SET WQLkyLRf1 codeOverride;",
    "UNSET WQLkyLRf1 codeOverride;",
    "CLEAR WQLkyLRf1 codeOverride;",
]

for (const dsl of dsls) {
    try {
        const r = await framer.agent.applyChanges(dsl, { pagePath: "/" })
        const after = await framer.agent.getNode(
            { id: "WQLkyLRf1" },
            { pagePath: "/" }
        )
        tries.push({
            dsl,
            status: r?.status,
            errors: r?.errors,
            override: after?.attributes?.codeOverride ?? null,
        })
        if (!after?.attributes?.codeOverride) break
    } catch (e) {
        tries.push({ dsl, error: String(e) })
    }
}

// Also try setAttributes if available
let attrTry = null
try {
    const node = await framer.getNode?.("WQLkyLRf1")
    if (node && typeof node.setAttributes === "function") {
        await node.setAttributes({ codeOverride: "" })
        const after = await framer.agent.getNode(
            { id: "WQLkyLRf1" },
            { pagePath: "/" }
        )
        attrTry = {
            method: "setAttributes",
            override: after?.attributes?.codeOverride ?? null,
        }
    } else {
        attrTry = { method: "setAttributes", available: false }
    }
} catch (e) {
    attrTry = { error: String(e) }
}

const desk1 = await framer.agent.getNode({ id: "WQLkyLRf1" }, { pagePath: "/" })
console.log(
    JSON.stringify(
        {
            tries,
            attrTry,
            finalOverride: desk1?.attributes?.codeOverride ?? null,
            files: (await framer.getCodeFiles()).map((f) => f.name),
        },
        null,
        2
    )
)

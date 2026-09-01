const nodes = await framer.agent.serializeNodes({
    ids: [
        "VBfODp8Ml",
        "lHV5aHgaZVBfODp8Ml",
        "Gz9TsJWVA",
        "lHV5aHgaZGz9TsJWVA",
    ],
    depth: 0,
    attributeFilter: ["name", "onTap"],
})

const byId = new Map(nodes.map((node) => [node.id, node]))
const actionsFor = (id) =>
    (byId.get(id)?.attributes?.onTap || []).filter(
        (action) => action.action && action.action !== "NONE"
    )

const ownsTransition = (id, value, variant, delay) => {
    const actions = actionsFor(id)
    return (
        actions.length === 2 &&
        actions.some(
            (action) =>
                action.action === "SET_VARIABLE_VALUE" &&
                action.controls?.variable ===
                    "var(--variable-w1Hbz14bi)" &&
                action.controls?.value === value
        ) &&
        actions.some(
            (action) =>
                action.action === "SET_VARIANT" &&
                action.controls?.variant === variant &&
                (action.delay || "0s") === delay
        )
    )
}

const checks = {
    openResetsState: ownsTransition("VBfODp8Ml", true, "lHV5aHgaZ", "0s"),
    closeResetsState: ownsTransition(
        "lHV5aHgaZVBfODp8Ml",
        false,
        "QZInDjV1k",
        "0.28s"
    ),
    wrappersEmpty:
        actionsFor("Gz9TsJWVA").length === 0 &&
        actionsFor("lHV5aHgaZGz9TsJWVA").length === 0,
}

const failed = Object.entries(checks)
    .filter(([, ok]) => !ok)
    .map(([name]) => name)

console.log(JSON.stringify({ checks, failed }, null, 2))
if (failed.length > 0) {
    throw new Error(`Repeat-cycle regression failed: ${failed.join(", ")}`)
}

const bars = await framer.agent.serializeNodes({
    ids: [
        "bEk1u9XFC",
        "BjqrvIntTbEk1u9XFC",
        "nyI5jW7lAbEk1u9XFC",
    ],
    depth: 0,
})

const opaque = bars.filter((bar) => bar.attributes?.fill != null)
if (opaque.length > 0) {
    throw new Error(
        `Closed Nav Bar has background: ${opaque
            .map((bar) => `${bar.id}=${bar.attributes.fill}`)
            .join(", ")}`
    )
}

console.log(
    JSON.stringify({ ok: true, ids: bars.map((bar) => bar.id) }, null, 2)
)

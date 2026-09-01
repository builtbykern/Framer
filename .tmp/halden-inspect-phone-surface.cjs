const ids = [
    "nyI5jW7lA",
    "nyI5jW7lAURKicPmXy",
    "nyI5jW7lARV7bjlgdh",
    "nyI5jW7lAbEk1u9XFC",
    "BjqrvIntTURKicPmXy",
]
const out = {}
for (const id of ids) {
    const n = await framer.agent.getNode({ id }, { pagePath: "/" })
    const a = n?.attributes || {}
    out[id] = {
        name: n?.name || a.name,
        type: n?.type,
        w: a.width,
        h: a.height,
        pos: a.position,
        top: a.top,
        left: a.left,
        pad: a.padding,
        gap: a.gap,
        overflow: a.overflow,
        layout: a.layout,
        dir: a.stackDirection,
        kids: n?.children?.map((c) => ({
            id: c.id,
            name: c.name || c.attributes?.name,
            w: c.attributes?.width,
            h: c.attributes?.height,
            pos: c.attributes?.position,
        })),
    }
}
console.log(JSON.stringify(out, null, 2))

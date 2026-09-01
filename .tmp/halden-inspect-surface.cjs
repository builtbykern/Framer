const surf = await framer.agent.getNode({ id: "URKicPmXy" }, { pagePath: "/" })
const t = await framer.agent.getNode({ id: "BjqrvIntTURKicPmXy" }, { pagePath: "/" })
const a = surf?.attributes || {}
const b = t?.attributes || {}
console.log(JSON.stringify({
    d: { h: a.height, fill: a.fill, overflow: a.overflow, layout: a.layout },
    t: { h: b.height, fill: b.fill, overflow: b.overflow, layout: b.layout },
}, null, 2))

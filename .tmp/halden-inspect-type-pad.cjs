const ids = ["XwtyrQVdF", "GAokM9PPJ", "FddpNYFNF", "KSgxSNQ22", "YonVwWSco", "RV7bjlgdh"]
const out = {}
for (const id of ids) {
    const n = await framer.agent.getNode({ id }, { pagePath: "/" })
    const a = n?.attributes || {}
    out[id] = {
        name: n?.name || a.name,
        w: a.width,
        h: a.height,
        pad: a.padding,
        vis: a.visible,
        fontSize: a.fontSize,
        text: typeof a.text === "string" ? a.text.slice(0, 80) : a.text,
        heightInst: a.height,
    }
}
const drift = await framer.agent.getNode({ id: "RV7bjlgdh" }, { pagePath: "/" })
out.desktopPlane = {
    h: drift?.attributes?.height,
    w: drift?.attributes?.width,
    view: drift?.attributes?.$control__view,
}
console.log(JSON.stringify(out, null, 2))

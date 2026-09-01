const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

function pick(n, extra = []) {
    if (!n) return null
    const a = n.attributes || {}
    const out = {
        id: n.id,
        name: a.name || n.name,
        type: n.type,
        width: a.width,
        height: a.height,
        visible: a.visible,
        fontSize: a.fontSize,
        fontWeight: a.fontWeight,
        lineHeight: a.lineHeight,
        letterSpacing: a.letterSpacing,
        fontSelector: a.fontSelector,
        overflow: a.overflow,
    }
    for (const k of extra) out[k] = a[k]
    const controls = {}
    for (const [k, v] of Object.entries(a)) {
        if (k.startsWith("$control__")) controls[k] = v
    }
    if (Object.keys(controls).length) out.controls = controls
    return out
}

const ids = [
    "GAokM9PPJ",
    "FddpNYFNF",
    "XwtyrQVdF",
    "KSgxSNQ22",
    "nt9Gs3MMs",
    "cMyCjMOpL",
    "yGFlVus2I",
    "gSGwySyKV",
    "RV7bjlgdh",
    "BjqrvIntTRV7bjlgdh",
    "nyI5jW7lARV7bjlgdh",
    "URKicPmXy",
    "BjqrvIntTURKicPmXy",
    "nyI5jW7lAURKicPmXy",
    "bEk1u9XFC",
    "BjqrvIntTbEk1u9XFC",
    "nyI5jW7lAbEk1u9XFC",
]

const nodes = {}
for (const id of ids) {
    try {
        const n = await framer.agent.getNode({ id }, { pagePath: "/" })
        nodes[id] = pick(n, ["padding", "top", "position", "overflow"])
    } catch (e) {
        nodes[id] = String(e)
    }
}

const card = await framer.agent.serialize(
    {
        id: "gSGwySyKV",
        depth: 3,
        attributeFilter: [
            "name",
            "visible",
            "height",
            "width",
            "fontSize",
            "lineHeight",
            "letterSpacing",
            "fontSelector",
            "overflow",
        ],
    },
    { pagePath: "/" }
)

console.log(
    JSON.stringify(
        {
            project: info.name,
            nodes,
            card,
        },
        null,
        2
    ).slice(0, 18000)
)

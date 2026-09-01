const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const applied = await framer.agent.applyChanges(
    [
        'SET BjqrvIntTURKicPmXy height="100vh" overflow="clip";',
        'SET BjqrvIntTRV7bjlgdh height="100%";',
        'SET nyI5jW7lAbEk1u9XFC position="fixed" top="0px" width="100%" zIndex="10";',
        'SET nyI5jW7lAURKicPmXy height="100vh" overflow="clip";',
        'SET nyI5jW7lARV7bjlgdh height="100%";',
        'SET RV7bjlgdh $control__view="drift" $control__workList.0="H9TnltXVB";',
        'SET BjqrvIntTRV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB";',
        'SET nyI5jW7lARV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB";',
    ].join(" "),
    { pagePath: "/" }
)

function pick(n) {
    const a = n?.attributes || {}
    return {
        id: n?.id,
        name: n?.name,
        w: a.width,
        h: a.height,
        pos: a.position,
        overflow: a.overflow,
        view: a.$control__view,
        padTop: a.$control__padTop,
        padBottom: a.$control__padBottom,
    }
}

const after = await framer.agent.serializeNodes(
    {
        ids: [
            "BjqrvIntTURKicPmXy",
            "BjqrvIntTRV7bjlgdh",
            "nyI5jW7lAbEk1u9XFC",
            "nyI5jW7lAURKicPmXy",
            "nyI5jW7lARV7bjlgdh",
            "URKicPmXy",
            "RV7bjlgdh",
        ],
        depth: 0,
    },
    { pagePath: "/" }
)

const fs = require("fs")
const path = require("path")
const out = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(out, { recursive: true })
const shots = {}
for (const [id, name] of [
    ["WQLkyLRf1", "desktop-fill.png"],
    ["BjqrvIntT", "tablet-fill.png"],
    ["nyI5jW7lA", "phone-fill.png"],
]) {
    try {
        const r = await framer.screenshot(id, { format: "png", scale: 1 })
        fs.writeFileSync(path.join(out, name), r.data)
        shots[name] = r.data.length
    } catch (e) {
        shots[name] = String(e)
    }
}

console.log(
    JSON.stringify(
        {
            project: info.name,
            errors: applied.errors,
            after: after.map(pick),
            shots,
        },
        null,
        2
    )
)

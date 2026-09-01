const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const files = await framer.getCodeFiles()
if (!files.length) throw new Error("empty getCodeFiles")

const card = await framer.agent.getNode({ id: "gSGwySyKV" }, { pagePath: "/" })
function walk(n, acc = []) {
    if (!n) return acc
    acc.push(n)
    for (const c of n.children || []) walk(c, acc)
    return acc
}
const metaLine = walk(card).find(
    (n) => n?.name === "Meta Line" || n?.attributes?.name === "Meta Line"
)

const applied = await framer.agent.applyChanges(
    [
        'SET RV7bjlgdh $control__view="drift" $control__workList.0="H9TnltXVB";',
        'SET BjqrvIntTRV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB" $control__padTop="72";',
        'SET nyI5jW7lARV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB";',
        'MOVE nt9Gs3MMs parent="gSGwySyKV" index="1";',
        'SET nt9Gs3MMs position="relative" top="auto" left="auto" width="100%" height="320px" overflow="clip";',
        'SET gSGwySyKV layout="stack" stackDirection="vertical" stackAlignment="start" stackDistribution="start" gap="8px" height="auto" overflow="visible";',
        'SET YonVwWSco layout="stack" stackDirection="vertical" stackAlignment="start" width="100%" height="auto" overflow="visible" gap="6px";',
        'SET GAokM9PPJ width="100%" height="auto" overflow="visible";',
        'SET XwtyrQVdF width="100%" height="auto";',
        'SET FddpNYFNF width="100%" height="auto" overflow="visible" fontSize="11px" lineHeight="1.4em";',
        'SET cMyCjMOpL width="100%" height="auto" overflow="visible";',
        'SET yGFlVus2I width="100%" height="auto";',
        'SET tpUu5gNAo visible="false";',
        metaLine?.id
            ? `SET ${metaLine.id} layout="stack" stackDirection="vertical" stackAlignment="start" width="100%" height="auto" overflow="visible";`
            : "",
    ]
        .filter(Boolean)
        .join(" "),
    { pagePath: "/" }
)

const cover = await framer.agent.getNode({ id: "nt9Gs3MMs" }, { pagePath: "/" })
const a = cover?.attributes || {}
console.log(
    JSON.stringify(
        {
            project: info.name,
            metaLine: metaLine?.id || null,
            cover: {
                position: a.position,
                width: a.width,
                height: a.height,
                top: a.top,
                left: a.left,
            },
            applied,
        },
        null,
        2
    )
)

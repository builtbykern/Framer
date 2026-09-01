const expected = new Map([
    ["RV7bjlgdh", { scale: 1.08, spacing: 1.08 }],
    ["BjqrvIntTRV7bjlgdh", { scale: 0.86, spacing: 0.74 }],
    ["nyI5jW7lARV7bjlgdh", { scale: 0.7, spacing: 0.58 }],
])

const nodes = await framer.getNodesWithType("ComponentInstanceNode")
const checks = []

for (const node of nodes) {
    const target = expected.get(node.id)
    if (!target) continue
    const layout = node.controls?.layout
    checks.push({
        id: node.id,
        actual: layout,
        pass:
            layout?.scale === target.scale &&
            layout?.spacing === target.spacing,
    })
}

if (
    checks.length !== expected.size ||
    checks.some((check) => !check.pass)
) {
    throw new Error(JSON.stringify(checks))
}

console.log(JSON.stringify(checks, null, 2))

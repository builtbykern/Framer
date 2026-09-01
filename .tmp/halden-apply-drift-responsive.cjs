const fs = require("node:fs")

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const file = await framer.getCodeFile("Drift_Plane.tsx")
if (!file) throw new Error("Drift_Plane.tsx not found")

const source = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Drift_Plane.tsx",
    "utf8"
)
const updated = await file.setFileContent(source)
const typeErrors = await updated.typecheck({ strict: true })
if (typeErrors.length > 0) throw new Error(JSON.stringify(typeErrors))

const targets = new Map([
    ["RV7bjlgdh", { scale: 1.08, spacing: 1.08 }],
    ["BjqrvIntTRV7bjlgdh", { scale: 0.86, spacing: 0.74 }],
    ["nyI5jW7lARV7bjlgdh", { scale: 0.7, spacing: 0.58 }],
])
const nodes = await framer.getNodesWithType("ComponentInstanceNode")
const updatedControls = []

for (const node of nodes) {
    const layout = targets.get(node.id)
    if (!layout) continue
    const previous = node.controls || {}
    await node.setAttributes({
        controls: {
            ...previous,
            layout: {
                ...(previous.layout || {}),
                ...layout,
            },
        },
    })
    updatedControls.push({ id: node.id, layout })
}

if (updatedControls.length !== targets.size) {
    throw new Error(`Updated ${updatedControls.length}/${targets.size} instances`)
}

console.log(JSON.stringify({ typeErrors, updatedControls }, null, 2))

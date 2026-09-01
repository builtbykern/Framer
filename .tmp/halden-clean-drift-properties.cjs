const fs = require("fs")
const path = require("path")

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const sourcePath =
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Drift_Plane.tsx"
const source = fs.readFileSync(sourcePath, "utf8")
const forbidden = [
    /\bcMS\b/,
    /\bPlaneView\b/,
    /\bclickExit\b/,
    /\bappearOn\b/,
    /\bplayIntro\b/,
    /\bintroHot\b/,
    /title:\s*"Appear"/,
    /view:\s*"drift"/,
]
for (const pattern of forbidden) {
    if (pattern.test(source)) {
        throw new Error(`Legacy Drift property remains: ${pattern}`)
    }
}

const file = await framer.getCodeFile("Drift_Plane.tsx")
if (!file) throw new Error("Drift_Plane.tsx not found")
const updated = await file.setFileContent(source)
const typeErrors = await updated.typecheck({ strict: true })
if (typeErrors.length > 0) throw new Error(JSON.stringify(typeErrors))

const controls = await framer.agent.readComponentControls({
    componentIds: ["codeFile/Og5966a:default"],
})
const nodes = await framer.agent.serializeNodes({
    ids: ["RV7bjlgdh", "BjqrvIntTRV7bjlgdh", "nyI5jW7lARV7bjlgdh"],
    depth: 0,
})

const outputDir = "/Users/noel/Desktop/Framer/.tmp/halden-drift-properties"
fs.mkdirSync(outputDir, { recursive: true })
const shots = {}
for (const [id, name] of [
    ["WQLkyLRf1", "desktop.jpg"],
    ["BjqrvIntT", "tablet.jpg"],
    ["nyI5jW7lA", "phone.jpg"],
]) {
    const result = await framer.screenshot(id, { format: "jpeg", scale: 1 })
    const outputPath = path.join(outputDir, name)
    fs.writeFileSync(outputPath, result.data)
    shots[name] = outputPath
}

console.log(
    JSON.stringify({ ok: true, typeErrors, controls, nodes, shots }, null, 2)
)

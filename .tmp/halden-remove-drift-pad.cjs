const fs = require("fs")
const path = require("path")

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const sourcePath =
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Drift_Plane.tsx"
const source = fs.readFileSync(sourcePath, "utf8")
for (const legacy of [
    "padTop",
    "padBottom",
    "Pad Top",
    "Pad Bottom",
    "chromePadTop",
    "chromePadBottom",
]) {
    if (source.includes(legacy)) {
        throw new Error(`Legacy Drift padding remains: ${legacy}`)
    }
}

const file = await framer.getCodeFile("Drift_Plane.tsx")
if (!file) throw new Error("Drift_Plane.tsx not found")
const updated = await file.setFileContent(source)
const typeErrors = await updated.typecheck({ strict: true })
if (typeErrors.length > 0) throw new Error(JSON.stringify(typeErrors))

const cleanup = await framer.agent.applyChanges(
    [
        "SET RV7bjlgdh $control__padTop=null $control__padBottom=null;",
        "SET BjqrvIntTRV7bjlgdh $control__padTop=null $control__padBottom=null;",
        "SET nyI5jW7lARV7bjlgdh $control__padTop=null $control__padBottom=null;",
    ].join("\n"),
    { pagePath: "/" }
)

const controls = await framer.agent.readComponentControls({
    componentIds: ["codeFile/Og5966a:default"],
})
const nodes = await framer.agent.serializeNodes({
    ids: ["RV7bjlgdh", "BjqrvIntTRV7bjlgdh", "nyI5jW7lARV7bjlgdh"],
    depth: 0,
})

const outputDir = "/Users/noel/Desktop/Framer/.tmp/halden-drift-pad"
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
    JSON.stringify(
        { ok: true, typeErrors, cleanup, controls, nodes, shots },
        null,
        2
    )
)

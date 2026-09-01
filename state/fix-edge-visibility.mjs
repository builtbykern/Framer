const fs = require("fs")

const info = await framer.getProjectInfo()
if (!String(info.name || "").includes("Collaborative")) {
    throw new Error("Wrong project: " + info.name)
}

const shaderCode = fs.readFileSync(
    "/Users/noel/Desktop/Framer/state/Edge_Refraction_Shader.tsx",
    "utf8"
)
const overrideCode = fs.readFileSync(
    "/Users/noel/Desktop/Framer/state/EdgeRefractionOverride.tsx",
    "utf8"
)

const shader = await framer.getCodeFile("Edge_Refraction_Shader.tsx")
if (!shader) throw new Error("shader missing")
await shader.setFileContent(shaderCode)

let override = await framer.getCodeFile("EdgeRefractionOverride.tsx")
if (!override) {
    override = await framer.createCodeFile(
        "EdgeRefractionOverride.tsx",
        overrideCode
    )
} else {
    await override.setFileContent(overrideCode)
}

const rawId = String(override.id || "")
const shortId = rawId.startsWith("codeFile/")
    ? rawId.slice("codeFile/".length)
    : rawId
const overrideRef = "codeFile/" + shortId + ":withEdgeRefractionOverride"

const dsl = [
    'DEL KU0iJd4nS',
    '+FrameNode edgeFxFixed parent="WQLkyLRf1" position="0"',
    'SET edgeFxFixed name="Edge Refraction Viewport" position="fixed" left="0px" right="0px" top="0px" bottom="0px" width="100%" height="100%" zIndex="20" pointerEvents="none" overflow="hidden"',
    '+ComponentInstanceNode edgeShaderDemo parent="edgeFxFixed" position="0" component="codeFile/fSXYT_3:default"',
    'SET edgeShaderDemo name="Edge Refraction Shader" position="absolute" left="0px" right="0px" top="0px" bottom="0px" width="100%" height="100%" pointerEvents="none"',
    'SET WQLkyLRf1 codeOverride="' + overrideRef + '"',
].join(";\n")

const applied = await framer.agent.applyChanges(dsl, { pagePath: "/" })

const files = await framer.getCodeFiles()
console.log(
    JSON.stringify(
        {
            project: info.name,
            overrideRef: overrideRef,
            files: files.map((f) => ({
                name: f.name,
                id: f.id,
                exports: f.exports?.map((e) => e.name),
            })),
            applied: applied,
            shaderAlpha072: /alpha \* 0\.72/.test(shaderCode),
        },
        null,
        2
    )
)

const fs = require("fs")
const info = await framer.getProjectInfo()
if (!String(info.name || "").includes("Collaborative")) {
    throw new Error("Wrong project: " + info.name)
}
const shaderCode = fs.readFileSync(
    "/Users/noel/Desktop/Framer/state/Edge_Refraction_Shader.tsx",
    "utf8"
)
const shader = await framer.getCodeFile("Edge_Refraction_Shader.tsx")
await shader.setFileContent(shaderCode)

const top = await framer.screenshot("WQLkyLRf1", {
    format: "jpeg",
    quality: 85,
    scale: 1,
    clip: { x: 0, y: 0, width: 1200, height: 900 },
})
fs.writeFileSync(
    "/Users/noel/Desktop/Framer/state/edge-demo-top-fallback.jpg",
    top.data
)

const hasFallback = /mixBlendMode:\s*"screen"/.test(shaderCode)
const hasErrorText = /WebGL unavailable/.test(shaderCode)
console.log(
    JSON.stringify(
        {
            project: info.name,
            hasFallback,
            hasErrorText,
            bytes: top.data.length,
        },
        null,
        2
    )
)

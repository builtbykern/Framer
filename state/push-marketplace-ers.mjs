const fs = require("fs")

const content = fs.readFileSync(
    "/Users/noel/Desktop/Framer/state/Edge_Refraction_Shader.tsx",
    "utf8"
)

const info = await framer.getProjectInfo()
console.log("project", info.name, info.id)

let shaderFile = await framer.getCodeFile("Edge_Refraction_Shader.tsx")
if (!shaderFile) {
    const files = await framer.getCodeFiles()
    shaderFile = files.find((f) => (f.name || "").includes("Edge_Refraction"))
}
if (!shaderFile) throw new Error("Edge_Refraction_Shader.tsx missing")

await shaderFile.setFileContent(content)

let typeErrors = []
try {
    typeErrors = await shaderFile.typecheck({ strict: true })
} catch (e) {
    typeErrors = [{ message: "typecheck failed: " + String(e) }]
}

let clearApply = null
try {
    clearApply = await framer.agent.applyChanges(
        'SET WQLkyLRf1 codeOverride="";',
        { pagePath: "/" }
    )
} catch (e) {
    clearApply = { error: String(e) }
}

const files = await framer.getCodeFiles()
const override = files.find((f) =>
    (f.name || "").includes("EdgeRefractionOverride")
)
let removedOverride = false
let overrideError = null
if (override) {
    try {
        await override.remove()
        removedOverride = true
    } catch (e) {
        overrideError = String(e && e.message ? e.message : e)
    }
}

let overlay = null
try {
    overlay = await framer.agent.getNode({ id: "jabCEPhKE" }, { pagePath: "/" })
} catch (e) {
    overlay = { err: String(e) }
}

let desk = null
try {
    desk = await framer.agent.getNode({ id: "WQLkyLRf1" }, { pagePath: "/" })
} catch (e) {
    desk = { err: String(e) }
}

const afterFiles = await framer.getCodeFiles()

console.log(
    JSON.stringify(
        {
            ok: true,
            shaderId: shaderFile.id,
            lines: content.split("\n").length,
            hasFeDisplacement: content.includes("feDisplacementMap"),
            hasFollowScroll: content.includes("Follow Scroll"),
            hasCollectScrollRoots: content.includes("collectScrollRoots"),
            hasWebGL: /getContext\s*\(\s*['"]webgl/.test(content),
            typeErrorCount: typeErrors.length,
            typeErrors: typeErrors.slice(0, 10).map((d) => ({
                message: d.message || d.text || String(d),
                line: d.line ?? d.start?.line,
            })),
            clearApplyOk: !clearApply?.error,
            clearApply,
            removedOverride,
            overrideError,
            deskOverride: desk?.attributes?.codeOverride ?? desk?.err ?? null,
            overlay: overlay && {
                id: overlay.id,
                position: overlay.attributes?.position,
                zIndex: overlay.attributes?.zIndex,
            },
            remainingFiles: afterFiles.map((f) => ({
                id: f.id,
                name: f.name,
                exports: (f.exports || []).map((e) => e.name),
            })),
        },
        null,
        2
    )
)

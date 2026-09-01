const fs = require("fs")
const content = fs.readFileSync(
    "/Users/noel/Desktop/Framer/code-components/Edge_Refraction_Shader.tsx",
    "utf8"
)

const info = await framer.getProjectInfo()
if (!String(info.name || "").includes("Collaborative")) {
    throw new Error("Wrong project: " + info.name)
}

const shader = await framer.getCodeFile("Edge_Refraction_Shader.tsx")
if (!shader) throw new Error("shader missing")
await shader.setFileContent(content)

let typeErrors = []
try {
    typeErrors = await shader.typecheck({ strict: true })
} catch (e) {
    typeErrors = [{ message: String(e) }]
}

// Ensure demo Mode defaults are usable — pin Always On on instance if DSL allows
let pin = null
try {
    pin = await framer.agent.applyChanges(
        'SET jabCEPhKE advanced={"editorPreview":"Always On","respectReducedMotion":false};',
        { pagePath: "/" }
    )
} catch (e) {
    pin = { error: String(e) }
}

const checks = {
    hasPageRootFilter: content.includes("pageRoot.style.filter"),
    noSiblingTargets: !content.includes("overlayHost.contains"),
    hasFeDisplacement: content.includes("feDisplacementMap"),
    hasAlwaysOnDefault: content.includes('editorPreview: "Always On"'),
    noWebGL: !/getContext\s*\(\s*['"]webgl/.test(content),
    typeErrorCount: typeErrors.length,
}

const failed = Object.entries(checks)
    .filter(([k, v]) => k !== "typeErrorCount" && v !== true)
    .map(([k]) => k)
if (typeErrors.length) failed.push("typecheck")

console.log(
    JSON.stringify(
        {
            ok: failed.length === 0,
            failed,
            checks,
            typeErrors: typeErrors.slice(0, 5),
            pin,
            deskOverride: (
                await framer.agent.getNode({ id: "WQLkyLRf1" }, { pagePath: "/" })
            )?.attributes?.codeOverride ?? null,
        },
        null,
        2
    )
)

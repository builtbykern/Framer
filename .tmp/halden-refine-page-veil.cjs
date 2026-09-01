const fs = require("fs")
const path = require("path")

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const sourcePath =
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Page_Veil.tsx"
const source = fs.readFileSync(sourcePath, "utf8")
if (!source.includes("props.blurAmount ?? 4")) {
    throw new Error("Expected 4px Page Veil fallback")
}
if (!/title:\s*"Blur",\s*\n\s*defaultValue:\s*4,/.test(source)) {
    throw new Error("Expected 4px Page Veil control default")
}
if (!source.includes("props.duration ?? 490")) {
    throw new Error("Page Veil duration changed unexpectedly")
}
if (!source.includes('const EASE = "cubic-bezier(0.5, 0, 0.5, 1)"')) {
    throw new Error("Page Veil easing changed unexpectedly")
}

const file = await framer.getCodeFile("Page_Veil.tsx")
if (!file) throw new Error("Page_Veil.tsx not found")
const updated = await file.setFileContent(source)
const typeErrors = await updated.typecheck({ strict: true })
if (typeErrors.length > 0) throw new Error(JSON.stringify(typeErrors))

const instanceIds = [
    "NTEyuOtv3",
    "BjqrvIntTNTEyuOtv3",
    "nyI5jW7lANTEyuOtv3",
    "NPy89lI_k",
    "BV5dxVKN3NPy89lI_k",
    "h0q8NyaAQNPy89lI_k",
    "VJ2MAE1X_",
    "LSqc1L2WHVJ2MAE1X_",
    "Tf2mbU7BvVJ2MAE1X_",
]
const applied = await framer.agent.applyChanges(
    instanceIds.map((id) => `SET ${id} $control__blur=4;`).join("\n")
)
if (Object.keys(applied.errors || {}).length > 0) {
    throw new Error(JSON.stringify(applied.errors))
}

const nodes = await framer.agent.serializeNodes({
    ids: instanceIds,
    depth: 0,
})
const wrongBlur = nodes.filter(
    (node) => node.attributes?.["$control__blur"] !== "4"
)
if (wrongBlur.length > 0) {
    throw new Error(`Blur verification failed: ${JSON.stringify(wrongBlur)}`)
}

const outputDir = "/Users/noel/Desktop/Framer/.tmp/halden-veil-sotd"
fs.mkdirSync(outputDir, { recursive: true })
const shots = {}
for (const [id, name] of [
    ["WQLkyLRf1", "home-desktop.jpg"],
    ["nACIEuvcP", "404-desktop.jpg"],
    ["rtJNTCNFr", "work-desktop.jpg"],
    ["LSqc1L2WH", "work-tablet.jpg"],
    ["Tf2mbU7Bv", "work-phone.jpg"],
]) {
    const result = await framer.screenshot(id, { format: "jpeg", scale: 1 })
    const outputPath = path.join(outputDir, name)
    fs.writeFileSync(outputPath, result.data)
    shots[name] = outputPath
}

console.log(
    JSON.stringify(
        {
            ok: true,
            typeErrors,
            applied,
            blurValues: nodes.map((node) => ({
                id: node.id,
                blur: node.attributes?.["$control__blur"],
                duration: node.attributes?.["$control__duration"],
                delay: node.attributes?.["$control__delay"],
            })),
            shots,
        },
        null,
        2
    )
)

/**
 * Pass/fail for real content edge refraction (no glass chrome).
 * Exit via thrown Error = RED.
 */
const file = await framer.getCodeFile("Edge_Refraction_Shader.tsx")
const code = file?.content || ""

const failures = []

if (/getContext\s*\(\s*["']webgl/.test(code)) {
    failures.push("HAS_WEBGL_RIM — remove self-lit WebGL path")
}
if (/gl_FragColor/.test(code)) {
    failures.push("HAS_FRAGCOLOR — glass fragment still present")
}
if (!code.includes("feDisplacementMap") && !code.includes("feDisplacementMap")) {
    failures.push("NO_DISPLACEMENT — missing feDisplacementMap")
}
if (!code.includes("mountContentWarp") && !code.includes("createContentWarp")) {
    failures.push("NO_CONTENT_WARP — missing createContentWarp/mount")
}
if (!code.includes("buildViewportEdgeMask")) {
    failures.push("NO_VIEWPORT_MASK — missing viewport-local edge mask")
}
if (/ControlType\.Slot/.test(code) || /children\?:/.test(code)) {
    failures.push("HAS_SLOT_OR_CHILDREN — must not use content select")
}
if (!/idleAmount[\s\S]{0,80}defaultValue:\s*0/.test(code)) {
    failures.push("IDLE_DEFAULT_NOT_ZERO")
}

const overlay = await framer.agent
    .getNode({ id: "jabCEPhKE" }, { pagePath: "/" })
    .catch(() => null)

const result = {
    ok: failures.length === 0,
    failures,
    lines: code.split("\n").length,
    hasDisplacement: code.includes("DisplacementMap"),
    hasViewportMask: code.includes("buildViewportEdgeMask"),
    hasWebGL: /getContext\s*\(\s*["']webgl/i.test(code),
    overlay: overlay && {
        id: overlay.id,
        position: overlay.attributes?.position,
        zIndex: overlay.attributes?.zIndex,
        width: overlay.attributes?.width,
        height: overlay.attributes?.height,
    },
}

console.log(JSON.stringify(result, null, 2))

if (failures.length > 0) {
    throw new Error("EDGE_REFRACTION_DIAG_RED: " + failures.join("; "))
}

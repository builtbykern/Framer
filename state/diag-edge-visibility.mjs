/**
 * Red-capable signal for "Edge refraction not visible".
 * Fail if: (1) no backdrop sampling, (2) rest alpha too low, (3) static path blanks GL.
 * Exit 1 = effect structurally invisible / broken for users.
 */
const fs = require("fs")

const file = await framer.getCodeFile("Edge_Refraction_Shader.tsx")
const code = file?.content || ""
const files = await framer.getCodeFiles()
const hasOverride = files.some((f) => /Override/i.test(f.name))

const ser = await framer.agent.serializeNodes(
    { ids: ["KU0iJd4nS", "WQLkyLRf1"], depth: 1 },
    { pagePath: "/" }
)
const inst = ser.find((n) => n.id === "KU0iJd4nS")
const desk = ser.find((n) => n.id === "WQLkyLRf1")

const checks = {
    samplesBackdrop: /sampler2D|texture2D|backdrop-filter|feDisplacementMap/.test(
        code
    ),
    hasIdleDefaultAboveZero: /idleAmount:\s*\{[^}]*defaultValue:\s*(?!0\b)[\d.]+/.test(
        code
    ),
    staticSkipsGL: /useIsStaticRenderer[\s\S]*?if\s*\(\s*isStatic\s*\)\s*return/.test(
        code
    ),
    fragMultipliesAlpha028: /alpha\s*\*\s*0\.28/.test(code),
    instancePresent: Boolean(inst),
    instanceFullBleed: Boolean(
        inst &&
            inst.attributes?.position === "absolute" &&
            inst.attributes?.width === "100%" &&
            inst.attributes?.height === "100%"
    ),
    deskHasStaleOverride: Boolean(desk?.attributes?.codeOverride),
    overrideFilePresent: hasOverride,
}

// Estimated peak edge alpha at intensity 0, edgeDepth 0.68:
// band ~= (0.18 + 0.42*0.68) = 0.4656; wave mid 0.5 → alpha ~= 0.4656*0.675 ~= 0.314
// * 0.28 ≈ 0.088 — below visibility threshold 0.15 on busy backgrounds
const estimatedRestPeakAlpha = 0.088
const VISIBILITY_FLOOR = 0.15

const failures = []
if (!checks.samplesBackdrop) {
    failures.push(
        "SHADER_NO_BACKDROP: WebGL paints self-lit white edges only; does not warp page content (unlike removed SVG override)."
    )
}
if (checks.fragMultipliesAlpha028 && estimatedRestPeakAlpha < VISIBILITY_FLOOR) {
    failures.push(
        `REST_ALPHA_TOO_LOW: estimated peak edge alpha ~${estimatedRestPeakAlpha} < ${VISIBILITY_FLOOR} with idleAmt=0.`
    )
}
if (checks.staticSkipsGL) {
    failures.push(
        "CANVAS_STATIC_BLANK: useIsStaticRenderer skips GL setup — effect invisible on Framer canvas static preview."
    )
}
if (!checks.instancePresent) {
    failures.push("INSTANCE_MISSING: EdgeRefractionShader not on Desktop.")
}
if (checks.deskHasStaleOverride) {
    failures.push("STALE_OVERRIDE: Desktop still references deleted override.")
}

const verdict = {
    ok: failures.length === 0,
    failures,
    checks,
    estimatedRestPeakAlpha,
    instanceId: inst?.id ?? null,
    instanceRect: inst?.$rect ?? null,
}

fs.writeFileSync(
    "/Users/noel/Desktop/Framer/state/edge-refraction-visibility.json",
    JSON.stringify(verdict, null, 2)
)
console.log(JSON.stringify(verdict, null, 2))
if (!verdict.ok) process.exitCode = 1

const fs = require("fs")
const code = fs.readFileSync(
  "/Users/noel/Desktop/Framer/.tmp/BuiltByKern_ScrollBlur.tsx",
  "utf8"
)

const file = await framer.getCodeFile("yC_uQFE")
await file.setFileContent(code)
const diagnostics = await file.typecheck({ strict: true })
const errors = (diagnostics ?? []).filter(
  (d) => d.category === "error" || d.category === 1
)

const softMotion = {
  settleMs: 520,
  fadeIn: {
    type: "tween",
    duration: 0.42,
    ease: [0.22, 1, 0.36, 1],
    delay: 0,
  },
  fadeOut: {
    type: "tween",
    duration: 0.72,
    ease: [0.33, 0, 0.2, 1],
    delay: 0,
  },
}

const node = await framer.getNode("lpuQSsTX0")
await framer.setAttributes("lpuQSsTX0", {
  controls: {
    ...node.controls,
    shape: node.controls?.shape === "u" ? "u" : "edge",
    motion: {
      ...(node.controls?.motion ?? {}),
      ...softMotion,
    },
    advanced: {
      ...(node.controls?.advanced ?? {}),
      editorPreview: "Follow Scroll",
    },
  },
})

const after = await framer.getNode("lpuQSsTX0")
console.log(
  JSON.stringify(
    {
      typeErrors: errors.length,
      diagnostics: (diagnostics ?? []).slice(0, 6),
      settle: after?.controls?.motion?.settleMs,
      fadeIn: after?.controls?.motion?.fadeIn,
      fadeOut: after?.controls?.motion?.fadeOut,
      preview: after?.controls?.advanced?.editorPreview,
      codeHasHysteresis: code.includes("IDLE_STRENGTH_FLOOR"),
      layerCount3: code.includes("LAYER_COUNT = 3"),
    },
    null,
    2
  )
)

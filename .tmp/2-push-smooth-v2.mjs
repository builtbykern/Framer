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

// Keep settle high on the demo instance (transitions remapped in code).
const node = await framer.getNode("lpuQSsTX0")
await framer.setAttributes("lpuQSsTX0", {
  controls: {
    ...node.controls,
    motion: {
      ...(node.controls?.motion ?? {}),
      settleMs: 520,
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
      settle: after?.controls?.motion?.settleMs,
      fadeInK: after?.controls?.motion?.fadeIn?.stiffness,
      editorPreview: after?.controls?.advanced?.editorPreview,
    },
    null,
    2
  )
)

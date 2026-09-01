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

const node = await framer.getNode("lpuQSsTX0")
await framer.setAttributes("lpuQSsTX0", {
  controls: {
    ...node.controls,
    shape: "edge",
  },
})

const after = await framer.getNode("lpuQSsTX0")
console.log(
  JSON.stringify(
    {
      typeErrors: errors.length,
      diagnostics: (diagnostics ?? []).slice(0, 5),
      shape: after?.controls?.shape,
      shapeOptions: after?.typedControls?.shape?.options,
    },
    null,
    2
  )
)

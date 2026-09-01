const fs = require("fs")
const path = "/Users/noel/Desktop/Framer/.tmp/BuiltByKern_ScrollBlur.tsx"
const code = fs.readFileSync(path, "utf8")

const file = await framer.getCodeFile("yC_uQFE")
await file.setFileContent(code)

const diagnostics = await file.typecheck({ strict: true })
const errors = (diagnostics ?? []).filter(
  (d) => d.category === "error" || d.category === 1
)

const motionAttr = JSON.stringify({
  settleMs: { type: "number", value: 480 },
  fadeIn: {
    type: "transition",
    value: {
      type: "tween",
      ease: [0.22, 1, 0.36, 1],
      duration: 0.42,
      delay: 0,
      stagger: 0,
    },
  },
  fadeOut: {
    type: "transition",
    value: {
      type: "tween",
      ease: [0.33, 0, 0.2, 1],
      duration: 0.72,
      delay: 0,
      stagger: 0,
    },
  },
})

const pagePath = "/"
const apply = await framer.agent.applyChanges(
  `SET lpuQSsTX0 $control__motion=${JSON.stringify(motionAttr)}`,
  { pagePath }
)

const blur = await framer.agent.serialize(
  {
    id: "lpuQSsTX0",
    depth: 0,
    attributeFilter: ["$control__motion", "$control__advanced"],
  },
  { pagePath }
)

console.log(
  JSON.stringify(
    {
      typeErrors: errors.length,
      diagnostics: (diagnostics ?? []).slice(0, 8),
      apply,
      motionPreview: String(blur?.attributes?.$control__motion ?? "").slice(
        0,
        280
      ),
    },
    null,
    2
  )
)

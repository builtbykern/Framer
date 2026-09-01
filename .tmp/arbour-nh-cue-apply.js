const fs = require("fs")
const code = fs.readFileSync(
  "/Users/noel/Desktop/Framer/.tmp/Arbour_TerritoryHoverMedia.tsx",
  "utf8"
)
const file = (await framer.getCodeFiles()).find((f) => f.id === "nMMl08t")
await file.setFileContent(code)

const PAPER = "var(--token-d5b3c09d-0364-4ed0-8804-e56957faa275)"

// Photo grows: 380 media + ~48 cue strip. T/P: 300 + 48.
const dsl = [
  `SET hX5NduSNi height="428px" minHeight="428px" maxHeight="428px"`,
  `SET aJLpuUP0qhX5NduSNi height="348px" minHeight="348px" maxHeight="348px"`,
  `SET Qonafp_oDhX5NduSNi height="348px" minHeight="348px" maxHeight="348px"`,
  // Extra air under dossier copy
  `SET QAa2V2fag padding="24px 24px 40px 24px" backgroundColor="${PAPER}" border="0px"`,
  `SET aJLpuUP0qQAa2V2fag padding="24px 24px 36px 24px" backgroundColor="${PAPER}" border="0px"`,
  `SET Qonafp_oDQAa2V2fag padding="20px 20px 36px 20px" backgroundColor="${PAPER}" border="0px"`,
].join(";\n")

const res = await framer.agent.applyChanges(dsl, { pagePath: "/neighbourhoods" })

const photo = await framer.agent.serialize({ id: "hX5NduSNi", depth: 1 }, {})
const dossier = await framer.agent.serialize({ id: "QAa2V2fag", depth: 1 }, {})
const content = file.content || ""

console.log(
  JSON.stringify(
    {
      message: res?.message,
      errors: res?.errors,
      photoH: photo.attributes?.height,
      dossierPad: dossier.attributes?.padding,
      hasCue: content.includes("arbour-thm__cue"),
      hasArrowAnim: content.includes("translateX"),
    },
    null,
    2
  )
)

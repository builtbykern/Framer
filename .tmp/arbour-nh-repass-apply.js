const fs = require("fs")
const code = fs.readFileSync(
  "/Users/noel/Desktop/Framer/.tmp/Arbour_TerritoryHoverMedia.tsx",
  "utf8"
)
const file = (await framer.getCodeFiles()).find((f) => f.id === "nMMl08t")
await file.setFileContent(code)

const PAPER = "var(--token-d5b3c09d-0364-4ed0-8804-e56957faa275)"
const INK_SOFT = "var(--token-0bc68d0d-4c0b-4126-8cce-9425cb153f4e)"

const dsl = [
  // UI-1 photo height
  `SET hX5NduSNi height="380px" minHeight="380px" maxHeight="380px"`,
  `SET aJLpuUP0qhX5NduSNi height="300px" minHeight="300px" maxHeight="300px"`,
  `SET Qonafp_oDhX5NduSNi height="300px" minHeight="300px" maxHeight="300px"`,
  // UI-2 dossier border off, keep Paper
  `SET QAa2V2fag border="0px" backgroundColor="${PAPER}"`,
  `SET aJLpuUP0qQAa2V2fag border="0px" backgroundColor="${PAPER}"`,
  `SET Qonafp_oDQAa2V2fag border="0px" backgroundColor="${PAPER}"`,
  // UI-3 intro trunc 3
  `SET v61cPV2xF textTruncation="3" textColor="${INK_SOFT}"`,
  `SET aJLpuUP0qv61cPV2xF textTruncation="3" textColor="${INK_SOFT}"`,
  `SET Qonafp_oDv61cPV2xF textTruncation="3" textColor="${INK_SOFT}"`,
].join(";\n")

const res = await framer.agent.applyChanges(dsl, { pagePath: "/neighbourhoods" })

const photo = await framer.agent.serialize({ id: "hX5NduSNi", depth: 1 }, {})
const dossier = await framer.agent.serialize({ id: "QAa2V2fag", depth: 1 }, {})
const intro = await framer.agent.serialize({ id: "v61cPV2xF", depth: 1 }, {})

console.log(
  JSON.stringify(
    {
      codeLen: code.length,
      message: res?.message,
      errors: res?.errors,
      photoH: photo.attributes?.height,
      dossierBorder: dossier.attributes?.border,
      introTrunc: intro.attributes?.textTruncation,
    },
    null,
    2
  )
)

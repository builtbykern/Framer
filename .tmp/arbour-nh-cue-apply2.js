const fs = require("fs")
const code = fs.readFileSync(
  "/Users/noel/Desktop/Framer/.tmp/Arbour_TerritoryHoverMedia.tsx",
  "utf8"
)

const files = await framer.getCodeFiles()
const file = files.find((f) => f.name === "Arbour_TerritoryHoverMedia.tsx" || f.id === "nMMl08t")
if (!file) {
  console.log(JSON.stringify({ error: "missing file", names: files.map((f) => f.name) }))
} else {
  await file.setFileContent(code)
  const PAPER = "var(--token-d5b3c09d-0364-4ed0-8804-e56957faa275)"
  const dsl = [
    `SET hX5NduSNi height="428px" minHeight="428px" maxHeight="428px"`,
    `SET aJLpuUP0qhX5NduSNi height="348px" minHeight="348px" maxHeight="348px"`,
    `SET Qonafp_oDhX5NduSNi height="348px" minHeight="348px" maxHeight="348px"`,
    `SET QAa2V2fag padding="24px 24px 40px 24px" backgroundColor="${PAPER}" border="0px"`,
    `SET aJLpuUP0qQAa2V2fag padding="24px 24px 36px 24px" backgroundColor="${PAPER}" border="0px"`,
    `SET Qonafp_oDQAa2V2fag padding="20px 20px 36px 20px" backgroundColor="${PAPER}" border="0px"`,
    `SET z2kRrpzAZ $control__cueBG="${PAPER}"`,
    `SET aJLpuUP0qz2kRrpzAZ $control__cueBG="${PAPER}"`,
    `SET Qonafp_oDz2kRrpzAZ $control__cueBG="${PAPER}"`,
  ].join(";\n")
  const res = await framer.agent.applyChanges(dsl, { pagePath: "/neighbourhoods" })
  const refreshed = (await framer.getCodeFiles()).find((f) => f.id === file.id)
  console.log(
    JSON.stringify(
      {
        fileId: file.id,
        codeLen: code.length,
        hasCue: (refreshed?.content || "").includes("arbour-thm__cue"),
        message: res?.message,
        errors: res?.errors,
      },
      null,
      2
    )
  )
}

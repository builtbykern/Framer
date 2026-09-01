const fs = require("fs")
const code = fs.readFileSync(
  "/Users/noel/Desktop/Framer/.tmp/Arbour_TerritoryHoverMedia.tsx",
  "utf8"
)

const files = await framer.getCodeFiles()
const file = files.find((f) => f.name === "Arbour_TerritoryHoverMedia.tsx")
if (!file) {
  console.log(JSON.stringify({ error: "no file", count: files.length, names: files.map((f) => f.name) }))
} else {
  await file.setFileContent(code)

  const PAPER = "var(--token-d5b3c09d-0364-4ed0-8804-e56957faa275)"
  const dsl = [
    // Restore media-only photo heights (finding 1)
    `SET hX5NduSNi height="380px" minHeight="380px" maxHeight="380px"`,
    `SET aJLpuUP0qhX5NduSNi height="300px" minHeight="300px" maxHeight="300px"`,
    `SET Qonafp_oDhX5NduSNi height="300px" minHeight="300px" maxHeight="300px"`,
    // Keep dossier air (finding 2 — padding only, no second Paper owner)
    `SET QAa2V2fag padding="24px 24px 40px 24px" backgroundColor="${PAPER}" border="0px"`,
    `SET aJLpuUP0qQAa2V2fag padding="24px 24px 36px 24px" backgroundColor="${PAPER}" border="0px"`,
    `SET Qonafp_oDQAa2V2fag padding="20px 20px 36px 20px" backgroundColor="${PAPER}" border="0px"`,
  ].join(";\n")

  const res = await framer.agent.applyChanges(dsl, { pagePath: "/neighbourhoods" })
  const refreshed = (await framer.getCodeFiles()).find((f) => f.id === file.id)
  const c = refreshed?.content || ""
  const photo = await framer.agent.serialize({ id: "hX5NduSNi", depth: 1 }, {})
  const dossier = await framer.agent.serialize({ id: "QAa2V2fag", depth: 1 }, {})

  console.log(
    JSON.stringify(
      {
        fileId: file.id,
        hasCue: c.includes("arbour-thm__cue"),
        hasOverlay: c.includes("arbour-thm__view"),
        hasArrow: c.includes("view-arrow"),
        noCueBgControl: !c.includes("cueBackground"),
        photoH: photo.attributes?.height,
        dossierPad: dossier.attributes?.padding,
        message: res?.message,
        errors: res?.errors,
      },
      null,
      2
    )
  )
}

const file = (await framer.getCodeFiles()).find((f) => f.id === "nMMl08t")
const content = file.content
const PAPER = "var(--token-d5b3c09d-0364-4ed0-8804-e56957faa275)"

// Bind cue BG to Paper token so strip matches dossier
const dsl = [
  `SET z2kRrpzAZ $control__cueBG="${PAPER}"`,
  `SET aJLpuUP0qz2kRrpzAZ $control__cueBG="${PAPER}"`,
  `SET Qonafp_oDz2kRrpzAZ $control__cueBG="${PAPER}"`,
].join(";\n")
const res = await framer.agent.applyChanges(dsl, { pagePath: "/neighbourhoods" })

console.log(
  JSON.stringify(
    {
      len: content.length,
      hasCue: content.includes("arbour-thm__cue"),
      hasArrow: content.includes("cue-arrow"),
      hasFlexCol: content.includes('flexDirection: "column"'),
      cueBgAt: content.indexOf("cueBackground"),
      applyMsg: res?.message,
      applyErr: res?.errors,
    },
    null,
    2
  )
)

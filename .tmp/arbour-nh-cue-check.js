const file = (await framer.getCodeFiles()).find((f) => f.id === "nMMl08t")
const content = file.content || ""
const preview = await framer.agent.publish({ action: "preview" })

console.log(
  JSON.stringify(
    {
      len: content.length,
      hasCue: content.includes("arbour-thm__cue"),
      hasArrow: content.includes("cue-arrow"),
      head: content.slice(0, 120),
      previewErrors: preview?.errors,
      previewWarnings: preview?.warnings,
      previewMessage: preview?.message,
      status: preview?.status,
    },
    null,
    2
  )
)

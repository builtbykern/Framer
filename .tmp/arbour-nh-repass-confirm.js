const dossier = await framer.agent.serialize({ id: "QAa2V2fag", depth: 1 }, {})
const photo = await framer.agent.serialize({ id: "hX5NduSNi", depth: 1 }, {})
const intro = await framer.agent.serialize({ id: "v61cPV2xF", depth: 1 }, {})
const photoT = await framer.agent.serialize({ id: "aJLpuUP0qhX5NduSNi", depth: 1 }, {})
const photoP = await framer.agent.serialize({ id: "Qonafp_oDhX5NduSNi", depth: 1 }, {})

const file = (await framer.getCodeFiles()).find((f) => f.id === "nMMl08t")
const keys = Object.keys(file || {})
const content =
  typeof file?.content === "string"
    ? file.content
    : typeof file?.code === "string"
      ? file.code
      : ""

console.log(
  JSON.stringify(
    {
      fileKeys: keys,
      photoD: photo.attributes?.height,
      photoT: photoT.attributes?.height,
      photoP: photoP.attributes?.height,
      dossierBorder: dossier.attributes?.border,
      dossierBg: dossier.attributes?.backgroundColor,
      introTrunc: intro.attributes?.textTruncation,
      contentLen: content.length,
      hasStage: content.includes("arbour-thm__stage"),
      hasOpacity02: content.includes("opacity 0.2s"),
      evenCadence: content.includes("setInterval") && !content.includes("setTimeout"),
    },
    null,
    2
  )
)

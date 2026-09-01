/**
 * Territory Card redesign — image-led editorial (baseline-ui + Arbour SOTD).
 *
 * baseline-ui → Framer:
 * - one accent (Chartreuse VIEW only)
 * - dense clamp (Intro 2 lines; Highlights off — raw CMS dump = slop)
 * - no gradients / glow / extra motion
 * - clear hierarchy: photo → title+VIEW → intro
 */
const PAPER = "var(--token-d5b3c09d-0364-4ed0-8804-e56957faa275)"
const INK = "var(--token-e2f9a9eb-668a-4021-80d9-b04413b5f392)"
const INK_SOFT = "var(--token-0bc68d0d-4c0b-4126-8cce-9425cb153f4e)"
const CHARTREUSE = "var(--token-db86917b-d19e-4fd7-8dc5-e260f1f35cb1)"
const BORDER = "1px solid rgba(28, 27, 22, 0.10)"

const cards = [
  { card: "i56eWdACt", dossier: "QAa2V2fag", photo: "hX5NduSNi", reading: "rIIdBjqU_", intro: "v61cPV2xF", highlights: "sJB1mG6E1", cta: "d9SNjsdke", title: "rie14TaT9", photoH: "220px", pad: "24px" },
  { card: "aJLpuUP0qi56eWdACt", dossier: "aJLpuUP0qQAa2V2fag", photo: "aJLpuUP0qhX5NduSNi", reading: "aJLpuUP0qrIIdBjqU_", intro: "aJLpuUP0qv61cPV2xF", highlights: "aJLpuUP0qsJB1mG6E1", cta: "aJLpuUP0qd9SNjsdke", title: "aJLpuUP0qrie14TaT9", photoH: "200px", pad: "22px" },
  { card: "Qonafp_oDi56eWdACt", dossier: "Qonafp_oDQAa2V2fag", photo: "Qonafp_oDhX5NduSNi", reading: "Qonafp_oDrIIdBjqU_", intro: "Qonafp_oDv61cPV2xF", highlights: "Qonafp_oDsJB1mG6E1", cta: "Qonafp_oDd9SNjsdke", title: "Qonafp_oDrie14TaT9", photoH: "200px", pad: "20px" },
]

const cmds = []

// Grid breathing room (desktop)
cmds.push(`SET km7dUqZI9 gap="24px"`)
cmds.push(`SET aJLpuUP0qkm7dUqZI9 gap="20px"`)
cmds.push(`SET Qonafp_oDkm7dUqZI9 gap="16px" layout="stack" stackDirection="vertical"`)

for (const c of cards) {
  // Image-led vertical card
  cmds.push(
    `SET ${c.card} stackDirection="vertical" stackDistribution="start" stackAlignment="start" gap="0px" height="auto" minHeight="null" maxHeight="null" overflow="clip" border="${BORDER}" borderRadius="0px"`
  )
  // Photo first
  cmds.push(`MOVE ${c.photo} parent="${c.card}" position="0"`)
  cmds.push(
    `SET ${c.photo} width="1fr" height="${c.photoH}" minHeight="${c.photoH}" maxHeight="${c.photoH}" aspectRatio=null overflow="clip"`
  )
  // Dossier under photo
  cmds.push(`MOVE ${c.dossier} parent="${c.card}" position="1"`)
  cmds.push(
    `SET ${c.dossier} width="1fr" height="auto" minHeight="null" maxHeight="null" padding="${c.pad}" gap="12px" stackDistribution="start" stackAlignment="start" backgroundColor="${PAPER}" overflow="clip"`
  )
  // Keep cartographic off
  // Reading stack tight
  cmds.push(`SET ${c.reading} gap="0px" width="1fr" height="auto"`)
  // Intro: 2-line clamp only (baseline dense)
  cmds.push(
    `SET ${c.intro} textTruncation="2" textColor="${INK_SOFT}" textStylePreset="Arbour/Body"`
  )
  // Highlights OFF — multiline CMS list fights hierarchy
  cmds.push(`SET ${c.highlights} visible=false`)
  // Title Ink + CTA Chartreuse Meta
  cmds.push(
    `SET ${c.title} textColor="${INK}" textStylePreset="Arbour/Subhead"`
  )
  cmds.push(
    `SET ${c.cta} text="VIEW →" textColor="${CHARTREUSE}" textStylePreset="Arbour/Meta"`
  )
}

const dsl = cmds.join(";\n")
const res = await framer.agent.applyChanges(dsl, { pagePath: "/neighbourhoods" })

const card = await framer.agent.serialize({ id: "i56eWdACt", depth: 4 }, {})
const order = (card.children || []).map((c) => c.name)
const photo = card.children?.find((c) => c.name === "Territory Photograph")
const dossier = card.children?.find((c) => c.name === "Territory Dossier")

console.log(
  JSON.stringify(
    {
      message: res?.message,
      errors: res?.errors,
      order,
      photoH: photo?.attributes?.height,
      dossierPad: dossier?.attributes?.padding,
      dossierGap: dossier?.attributes?.gap,
      cardDir: card.attributes?.stackDirection,
      cardH: card.attributes?.height,
      border: card.attributes?.border,
    },
    null,
    2
  )
)

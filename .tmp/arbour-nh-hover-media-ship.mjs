/**
 * Push Arbour_TerritoryHoverMedia + redesign Territory Cards (SOTD + hover cycle).
 */
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const code = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "Arbour_TerritoryHoverMedia.tsx"),
  "utf8"
)

const PAPER = "var(--token-d5b3c09d-0364-4ed0-8804-e56957faa275)"
const CHARTREUSE = "var(--token-db86917b-d19e-4fd7-8dc5-e260f1f35cb1)"
const INK = "var(--token-e2f9a9eb-668a-4021-80d9-b04413b5f392)"
const INK_SOFT = "var(--token-0bc68d0d-4c0b-4126-8cce-9425cb153f4e)"
const HERO = "var(--variable-dM8yn13g7)"
const MAP = "var(--variable-ppzgDk7Mi)"

let file = (await framer.getCodeFiles()).find((f) => /TerritoryHoverMedia/i.test(f.name || ""))
if (file) {
  await file.setFileContent(code)
} else {
  file = await framer.createCodeFile("Arbour_TerritoryHoverMedia.tsx", code)
}
const files = await framer.getCodeFiles()
file = files.find((f) => f.id === file.id) || file
const codeId = file.id

const slots = [
  { photo: "hX5NduSNi", dossier: "QAa2V2fag", card: "i56eWdACt", cta: "d9SNjsdke", intro: "v61cPV2xF", highlights: "sJB1mG6E1", title: "rie14TaT9", h: "320px", pad: "24px", tag: "thmD" },
  { photo: "aJLpuUP0qhX5NduSNi", dossier: "aJLpuUP0qQAa2V2fag", card: "aJLpuUP0qi56eWdACt", cta: "aJLpuUP0qd9SNjsdke", intro: "aJLpuUP0qv61cPV2xF", highlights: "aJLpuUP0qsJB1mG6E1", title: "aJLpuUP0qrie14TaT9", h: "260px", pad: "22px", tag: "thmT" },
  { photo: "Qonafp_oDhX5NduSNi", dossier: "Qonafp_oDQAa2V2fag", card: "Qonafp_oDi56eWdACt", cta: "Qonafp_oDd9SNjsdke", intro: "Qonafp_oDv61cPV2xF", highlights: "Qonafp_oDsJB1mG6E1", title: "Qonafp_oDrie14TaT9", h: "260px", pad: "20px", tag: "thmP" },
]

const cmds = []

// Grid air
cmds.push(`SET km7dUqZI9 gap="24px"`)
cmds.push(`SET aJLpuUP0qkm7dUqZI9 gap="20px"`)
cmds.push(`SET Qonafp_oDkm7dUqZI9 gap="16px"`)

for (const s of slots) {
  cmds.push(
    `SET ${s.card} stackDirection="vertical" stackDistribution="start" gap="0px" height="auto" minHeight="null" maxHeight="null" border="0px" borderRadius="0px" overflow="clip"`
  )
  cmds.push(`MOVE ${s.photo} parent="${s.card}" position="0"`)
  cmds.push(`MOVE ${s.dossier} parent="${s.card}" position="1"`)
  cmds.push(
    `SET ${s.photo} width="1fr" height="${s.h}" minHeight="${s.h}" maxHeight="${s.h}" aspectRatio=1.6 overflow="clip" fill="transparent" backgroundColor="transparent" hoverEffect=null`
  )
  cmds.push(
    `SET ${s.dossier} width="1fr" height="auto" minHeight="null" padding="${s.pad}" gap="12px" stackDistribution="start" backgroundColor="${PAPER}" border="1px solid rgba(28, 27, 22, 0.10)"`
  )
  cmds.push(`SET ${s.intro} textTruncation="2" textColor="${INK_SOFT}" textStylePreset="Arbour/Body"`)
  cmds.push(`SET ${s.highlights} visible=false`)
  cmds.push(`SET ${s.title} textColor="${INK}" textStylePreset="Arbour/Subhead"`)
  cmds.push(`SET ${s.cta} visible=false`)
  // Media component fills photo frame
  cmds.push(
    `+ComponentInstanceNode ${s.tag} parent="${s.photo}" component="codeFile/${codeId}:default" name="Arbour_TerritoryHoverMedia" width="1fr" height="1fr" position="absolute" top="0px" left="0px" right="0px" bottom="0px" $control__image=${HERO} $control__imageB=${MAP} $control__intervalMs=900 $control__zoom=1.04 $control__showView=true $control__viewLabel="VIEW →" $control__accent="${CHARTREUSE}"`
  )
}

const res = await framer.agent.applyChanges(cmds.join(";\n"), { pagePath: "/neighbourhoods" })

const photo = await framer.agent.serialize({ id: "hX5NduSNi", depth: 3 }, {})
console.log(
  JSON.stringify(
    {
      codeId,
      codeName: file.name,
      message: res?.message,
      errors: res?.errors,
      photoChildren: (photo.children || []).map((c) => ({
        id: c.id,
        name: c.name,
        component: c.component,
        image: c.attributes?.["$control__image"],
        imageB: c.attributes?.["$control__imageB"],
      })),
      photoH: photo.attributes?.height,
      cardBorder: (await framer.agent.serialize({ id: "i56eWdACt", depth: 1 }, {})).attributes?.border,
    },
    null,
    2
  )
)

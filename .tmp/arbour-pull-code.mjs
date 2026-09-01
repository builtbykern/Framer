const fs = require("fs")
const path = require("path")
const names = [
  "Arbour_ProgressiveBlur.tsx",
  "Arbour_InertiaFrame.tsx",
  "Arbour_ScrollCue.tsx",
  "Arbour_EditorialReveal.tsx",
  "Arbour_UnderlineLink.tsx",
  "Arbour_TerritoryRail.tsx",
  "Arbour_PrimaryButton.tsx",
  "Arbour_FormButton.tsx",
  "Arbour_SectionHeader.tsx",
  "Arbour_ArticleCard.tsx",
  "Arbour_StatsBand.tsx",
]
const dir = "/tmp/arbour-apply"
fs.mkdirSync(dir, { recursive: true })
const meta = []
for (const name of names) {
  const f = await framer.getCodeFile(name)
  if (!f) {
    meta.push({ name, missing: true })
    continue
  }
  fs.writeFileSync(path.join(dir, name), f.content)
  meta.push({
    name,
    id: f.id,
    lines: f.content.split("\n").length,
    hasStatic: /useIsStaticRenderer/.test(f.content),
    hasCanvas: /useIsOnFramerCanvas/.test(f.content),
    hasRM: /useReducedMotion/.test(f.content),
    hasWhileFocus: /whileFocus/.test(f.content),
    hasInView: /useInView/.test(f.content),
  })
}
console.log(JSON.stringify(meta, null, 2))

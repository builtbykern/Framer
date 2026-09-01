const fs = require("fs")
const path = require("path")
const dir = "/tmp/arbour-apply"
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
]
const out = []
for (const name of names) {
  const code = fs.readFileSync(path.join(dir, name), "utf8")
  const f = await framer.getCodeFile(name)
  if (!f) {
    out.push({ name, error: "missing" })
    continue
  }
  await f.setFileContent(code)
  out.push({
    name,
    lines: code.split("\n").length,
    hasStatic: /useIsStaticRenderer/.test(code),
  })
}
console.log(JSON.stringify(out, null, 2))

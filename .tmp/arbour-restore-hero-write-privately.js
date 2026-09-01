const fs = require("fs")
const pagePath = "/contact"
const T = "qjv2S9Wpa"
const P = "jEM0wBo2v"
const OLIVE = "var(--token-a16d0333-6bd5-4d60-aa00-fac26447145d)"
const INK = "var(--token-e2f9a9eb-668a-4021-80d9-b04413b5f392)"
const CHARTREUSE = "var(--token-db86917b-d19e-4fd7-8dc5-e260f1f35cb1)"

const proj = await framer.getProjectInfo()
if (proj.name !== "Arbour") throw new Error("wrong " + proj.name)

// Restore original UnderlineLink behavior
const file = await framer.getCodeFile("Arbour_UnderlineLink.tsx")
await file.setFileContent(fs.readFileSync(".tmp/Arbour_UnderlineLink.tsx", "utf8"))
console.log("UnderlineLink restored")

// Hero WRITE PRIVATELY → exact prior instance setup (no hover color control)
const dsl = [
  `SET uONXSHosa link.href="mailto:enquiries@arbour.london" cursor="pointer"`,
  `SET ${T}uONXSHosa link.href="mailto:enquiries@arbour.london" cursor="pointer"`,
  `SET ${P}uONXSHosa link.href="mailto:enquiries@arbour.london" cursor="pointer"`,

  `SET BMhLvwqld $control__decorative=true $control__label="WRITE PRIVATELY →" $control__text="${OLIVE}" $control__underline="${OLIVE}" $control__line="1" $control__offset="4" $control__newTab=false`,
  `SET ${T}BMhLvwqld $control__decorative=true $control__label="WRITE PRIVATELY →" $control__text="${OLIVE}" $control__underline="${OLIVE}" $control__line="1" $control__offset="4"`,
  `SET ${P}BMhLvwqld $control__decorative=true $control__label="WRITE PRIVATELY →" $control__text="${OLIVE}" $control__underline="${OLIVE}" $control__line="1" $control__offset="4"`,
].join("; ")

const r = await framer.agent.applyChanges(dsl, { pagePath })
console.log(JSON.stringify({ msg: r.message, errors: r.errors }))

// Clear hover prop on hero instances if still stored
for (const id of ["BMhLvwqld", `${T}BMhLvwqld`, `${P}BMhLvwqld`]) {
  const n = await framer.getNode(id)
  if (!n?.controls) continue
  const next = { ...n.controls }
  delete next.hover
  delete next.hoverColor
  try {
    await framer.setAttributes(id, {
      // @ts-expect-error controls shape
      controls: next,
    })
  } catch (e) {
    console.log("clear hover", id, e.message)
  }
}

// Re-apply controls without hover via DSL null if supported
const clearHover = [
  `SET BMhLvwqld $control__hover="null"`,
  `SET ${T}BMhLvwqld $control__hover="null"`,
  `SET ${P}BMhLvwqld $control__hover="null"`,
].join("; ")
const r2 = await framer.agent.applyChanges(clearHover, { pagePath })
console.log("clearHover", r2.message, r2.errors)

// Keep green pill fixed (Ink link, no scale) — not hero
const green = [
  `SET qB71RMXEV link="null" hoverEffect.scale="1" hoverEffect.opacity="0.92" fill="${CHARTREUSE}"`,
  `SET EuA2UleYw visible=false`,
].join("; ")
await framer.agent.applyChanges(green, { pagePath })

const hero = await framer.agent.serialize({ id: "BMhLvwqld", depth: 0 }, { pagePath })
console.log(
  "hero write now",
  Object.fromEntries(
    Object.entries(hero.attributes || {}).filter(([k]) => k.startsWith("$control"))
  )
)

const pub = await framer.publish()
console.log(JSON.stringify({ id: pub.deployment?.id, status: pub.deployment?.status }))

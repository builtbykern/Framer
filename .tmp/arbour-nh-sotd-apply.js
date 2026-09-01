/**
 * SOTD Territory Card polish — Arbour aesthetic.
 * Plan: design-plans/2026-08-01-arbour-neighbourhoods-territory-card-sotd.md
 */
const INK_SOFT = "var(--token-0bc68d0d-4c0b-4126-8cce-9425cb153f4e)"
const CHARTREUSE = "var(--token-db86917b-d19e-4fd7-8dc5-e260f1f35cb1)"

const dossiers = ["QAa2V2fag", "aJLpuUP0qQAa2V2fag", "Qonafp_oDQAa2V2fag"]
const readings = ["rIIdBjqU_", "aJLpuUP0qrIIdBjqU_", "Qonafp_oDrIIdBjqU_"]
const intros = ["v61cPV2xF", "aJLpuUP0qv61cPV2xF", "Qonafp_oDv61cPV2xF"]
const highlights = ["sJB1mG6E1", "aJLpuUP0qsJB1mG6E1", "Qonafp_oDsJB1mG6E1"]
const ctas = ["d9SNjsdke", "aJLpuUP0qd9SNjsdke", "Qonafp_oDd9SNjsdke"]

const cmds = []

for (const id of dossiers) {
  cmds.push(`SET ${id} stackDistribution="start" gap="20px"`)
}
for (const id of readings) {
  cmds.push(`SET ${id} gap="10px"`)
}
for (const id of intros) {
  cmds.push(`SET ${id} textTruncation="3"`)
}
for (const id of highlights) {
  cmds.push(
    `SET ${id} visible=true textTruncation="2" textColor="${INK_SOFT}" textStylePreset="Arbour/Meta"`
  )
}
for (const id of ctas) {
  cmds.push(
    `SET ${id} text="VIEW →" textColor="${CHARTREUSE}" textStylePreset="Arbour/Meta"`
  )
}

const dsl = cmds.join(";\n")
const res = await framer.agent.applyChanges(dsl, { pagePath: "/neighbourhoods" })

// Verify key attrs
async function snap(id) {
  try {
    const n = await framer.agent.serialize({ id, depth: 2 }, {})
    const a = n.attributes || {}
    let text = a.text
    if (!text && n.children?.[0]) {
      const run = JSON.stringify(n).match(/"text":"([^"]{1,40})"/)
      text = run?.[1]
    }
    return {
      id,
      name: n.name,
      stackDistribution: a.stackDistribution,
      gap: a.gap,
      visible: a.visible,
      textTruncation: a.textTruncation,
      textColor: a.textColor,
      textStylePreset: a.textStylePreset,
      text,
    }
  } catch (e) {
    return { id, error: String(e.message || e) }
  }
}

const verify = {
  dossier: await snap("QAa2V2fag"),
  reading: await snap("rIIdBjqU_"),
  intro: await snap("v61cPV2xF"),
  highlights: await snap("sJB1mG6E1"),
  cta: await snap("d9SNjsdke"),
}

console.log(
  JSON.stringify(
    {
      message: res?.message,
      nestedLinkWarn: res?.linter?.warnings?.["Links cannot be nested. Remove the `link` from either the nested element or the enclosing linked element."],
      errors: res?.errors,
      verify,
    },
    null,
    2
  )
)

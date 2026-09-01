const fs = require("fs")
const pagePath = "/contact"
const T = "qjv2S9Wpa"
const P = "jEM0wBo2v"
const INK = "var(--token-e2f9a9eb-668a-4021-80d9-b04413b5f392)"
const PAPER = "var(--token-d5b3c09d-0364-4ed0-8804-e56957faa275)"
const OLIVE = "var(--token-a16d0333-6bd5-4d60-aa00-fac26447145d)"

const proj = await framer.getProjectInfo()
if (proj.name !== "Arbour") throw new Error("wrong " + proj.name)

// Push code
for (const name of ["Arbour_UnderlineLink.tsx", "Arbour_FormButton.tsx"]) {
  const file = await framer.getCodeFile(name)
  await file.setFileContent(fs.readFileSync(".tmp/" + name, "utf8"))
  const refreshed = (await framer.getCodeFiles()).find((f) => f.id === file.id)
  const errs = await refreshed?.typecheck?.({ strict: true })
  console.log(name, "typeErrors", errs)
}

// WRITE PRIVATELY: own link (no parent <a> browser hover), Olive→Ink hover
// Direct Enquiry: remove frame link so children keep Arbour color
const dsl = [
  `SET uONXSHosa link="null" cursor="default"`,
  `SET ${T}uONXSHosa link="null" cursor="default"`,
  `SET ${P}uONXSHosa link="null" cursor="default"`,

  `SET BMhLvwqld $control__decorative=false $control__link="mailto:enquiries@arbour.london" $control__label="WRITE PRIVATELY →" $control__text="${OLIVE}" $control__underline="${OLIVE}" $control__hoverColor="${INK}"`,
  `SET ${T}BMhLvwqld $control__decorative=false $control__link="mailto:enquiries@arbour.london" $control__text="${OLIVE}" $control__underline="${OLIVE}" $control__hoverColor="${INK}"`,
  `SET ${P}BMhLvwqld $control__decorative=false $control__link="mailto:enquiries@arbour.london" $control__text="${OLIVE}" $control__underline="${OLIVE}" $control__hoverColor="${INK}"`,

  // Email row — make the address a plain Ink meta link via wrapping? keep text; add mailto on the rich text if possible
  // Subscribe → normal Ink primary button look
  `SET u2DLuU3hW $control__label="SUBSCRIBE →" $control__text="${PAPER}" $control__background="${INK}" $control__borderCSS="1px solid ${INK}"`,
  `SET ${T}u2DLuU3hW $control__label="SUBSCRIBE →" $control__text="${PAPER}" $control__background="${INK}" $control__borderCSS="1px solid ${INK}"`,
  `SET ${P}u2DLuU3hW $control__label="SUBSCRIBE →" $control__text="${PAPER}" $control__background="${INK}" $control__borderCSS="1px solid ${INK}"`,
].join("; ")

const r = await framer.agent.applyChanges(dsl, { pagePath })
console.log(JSON.stringify({ msg: r.message, errors: r.errors }))

// Ensure FormButton color props map — some instances use background vs backgroundColor
for (const id of ["u2DLuU3hW", `${T}u2DLuU3hW`, `${P}u2DLuU3hW`]) {
  try {
    await framer.setAttributes(id, {
      controls: undefined,
    })
  } catch {}
}

// Re-read submit button
const btn = await framer.agent.serialize({ id: "u2DLuU3hW", depth: 0 }, { pagePath })
const write = await framer.agent.serialize({ id: "BMhLvwqld", depth: 0 }, { pagePath })
const enq = await framer.agent.serialize({ id: "uONXSHosa", depth: 0 }, { pagePath })
console.log(
  "btn",
  JSON.stringify(
    Object.fromEntries(
      Object.entries(btn.attributes || {}).filter(([k]) => k.startsWith("$control"))
    )
  )
)
console.log(
  "write",
  JSON.stringify(
    Object.fromEntries(
      Object.entries(write.attributes || {}).filter(([k]) => k.startsWith("$control"))
    )
  )
)
console.log("enq link", enq.attributes?.link)

const res = await framer.publish()
console.log(JSON.stringify({ id: res.deployment?.id, status: res.deployment?.status }))

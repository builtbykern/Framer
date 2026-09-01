const pagePath = "/contact"
const T = "qjv2S9Wpa"

const proj = await framer.getProjectInfo()
if (proj.name !== "Arbour") throw new Error("wrong " + proj.name)

// Plan: 2026-08-02-contact-hero-dt-h1-legibility.md
// Widen Paper copy vs media; H1 maxWidth 100%; native overflow visible.
// Phone untouched. No gradient / wash / blend / Display Punch.

const dsl = [
  // Desktop copy | media balance (early beats-era weight)
  `SET AATw4pip9 width="1.08fr"`,
  `SET WLSMm5iy1 width="0.92fr"`,
  `SET R80e8PwNu maxWidth="100%"`,
  `SET qxIyvg6PE overflow="visible"`,
  `SET DpN8zutuL overflow="visible"`,

  // Tablet mirror
  `SET ${T}AATw4pip9 width="1.1fr"`,
  `SET ${T}WLSMm5iy1 width="0.9fr"`,
  `SET ${T}R80e8PwNu maxWidth="100%"`,
  `SET ${T}qxIyvg6PE overflow="visible"`,
  `SET ${T}DpN8zutuL overflow="visible"`,
].join("; ")

const r = await framer.agent.applyChanges(dsl, { pagePath })
console.log(JSON.stringify({ msg: r.message, errors: r.errors, warnings: r.warnings }))

// Force overflow via setAttributes if DSL soft-fails
for (const id of [
  "qxIyvg6PE",
  "DpN8zutuL",
  `${T}qxIyvg6PE`,
  `${T}DpN8zutuL`,
]) {
  try {
    await framer.setAttributes(id, { overflow: "visible" })
  } catch (e) {
    console.log("overflow", id, e.message)
  }
}

const check = {}
for (const [label, id] of [
  ["copyD", "AATw4pip9"],
  ["mediaD", "WLSMm5iy1"],
  ["h1D", "R80e8PwNu"],
  ["nativeD", "qxIyvg6PE"],
  ["copyT", `${T}AATw4pip9`],
  ["mediaT", `${T}WLSMm5iy1`],
  ["h1T", `${T}R80e8PwNu`],
  ["nativeT", `${T}qxIyvg6PE`],
]) {
  const n = await framer.getNode(id)
  check[label] = n
    ? { w: n.width, maxW: n.maxWidth, overflow: n.overflow }
    : null
}
console.log(JSON.stringify(check, null, 2))

const res = await framer.publish()
console.log(JSON.stringify({ id: res.deployment?.id, status: res.deployment?.status }))

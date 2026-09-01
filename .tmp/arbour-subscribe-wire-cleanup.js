const pagePath = "/contact"
const T = "qjv2S9Wpa"
const P = "jEM0wBo2v"
const PAPER = "var(--token-d5b3c09d-0364-4ed0-8804-e56957faa275)"
const RACING_DEEP = "var(--token-9d3d6ca5-f3ad-4d88-afc8-fc5bce03bd04)"

const proj = await framer.getProjectInfo()
if (proj.name !== "Arbour") throw new Error("wrong " + proj.name)

const keep = {
  eQW4MDduB: "nAkFsafK_",
  [`${T}eQW4MDduB`]: `${T}nAkFsafK_`,
  [`${P}eQW4MDduB`]: `${P}nAkFsafK_`,
}

const hideExtras = [
  "Dfs7kGE9j",
  "cAvQj4Bl2",
  "u2DLuU3hW",
  `${T}Dfs7kGE9j`,
  `${T}cAvQj4Bl2`,
  `${T}u2DLuU3hW`,
  `${P}Dfs7kGE9j`,
  `${P}cAvQj4Bl2`,
  `${P}u2DLuU3hW`,
]

for (const id of hideExtras) {
  const r = await framer.setAttributes(id, { visible: false }).catch((e) => ({ err: e.message }))
  console.log("hide", id, r?.id || r)
}

for (const [formId, btnId] of Object.entries(keep)) {
  // Ensure PrimaryButton controls
  await framer.setAttributes(btnId, {
    visible: true,
    name: "Submit Button",
  }).catch((e) => console.log("vis err", btnId, e.message))

  const dsl = [
    `SET ${btnId} visible=true name="Submit Button" $control__label="SUBSCRIBE →" $control__asSubmit=true $control__variant="dark" $control__fill="${RACING_DEEP}" $control__text="${PAPER}" width="1fr" height="fit-content"`,
  ].join("; ")
  const r1 = await framer.agent.applyChanges(dsl, { pagePath })
  console.log("btn", btnId, r1.message, r1.errors)

  // Try wiring form via setAttributes
  const r2 = await framer.setAttributes(formId, { formSubmitButtonId: btnId }).catch((e) => ({ err: e.message }))
  console.log("wire setAttributes", formId, r2?.id || r2, r2?.attributes?.formSubmitButtonId)

  // Also try applyChanges
  const r3 = await framer.agent.applyChanges(`SET ${formId} formSubmitButtonId="${btnId}"`, { pagePath })
  console.log("wire apply", formId, r3.message, r3.errors)
}

for (const formId of Object.keys(keep)) {
  const s = await framer.agent.serialize({ id: formId, depth: 2 }, { pagePath })
  console.log(
    "\nFORM",
    formId,
    "submitId=",
    s.attributes?.formSubmitButtonId,
    "\n",
    (s.children || [])
      .filter((c) => c.$componentDisplayName || c.name?.includes("Submit"))
      .map((c) => ({
        id: c.id,
        name: c.name,
        disp: c.$componentDisplayName,
        vis: c.attributes?.visible,
        label: c.attributes?.["$control__label"],
        asSubmit: c.attributes?.["$control__asSubmit"],
        variant: c.attributes?.["$control__variant"],
      }))
  )
}

const pub = await framer.publish()
console.log(JSON.stringify({ id: pub.deployment?.id, status: pub.deployment?.status }))

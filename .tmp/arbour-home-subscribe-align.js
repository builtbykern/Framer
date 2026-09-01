const pagePath = "/"
const PAPER = "var(--token-d5b3c09d-0364-4ed0-8804-e56957faa275)"
const RACING = "var(--token-9d3d6ca5-f3ad-4d88-afc8-fc5bce03bd04)"

const proj = await framer.getProjectInfo()
if (proj.name !== "Arbour") throw new Error("wrong " + proj.name)

// Home Journal subscribe forms — match Contact locked PrimaryButton light
const swaps = [
  { formId: "B3ONQd1BC", oldBtn: "EmgZfw7qw", newId: "homeSubPrimD" },
  { formId: "U3TeNUVXvB3ONQd1BC", oldBtn: "U3TeNUVXvEmgZfw7qw", newId: "homeSubPrimT" },
  { formId: "pmAxXUJ0oB3ONQd1BC", oldBtn: "pmAxXUJ0oEmgZfw7qw", newId: "homeSubPrimP" },
]

for (const { formId, oldBtn, newId } of swaps) {
  // Check existing kids — skip if PrimaryButton already visible
  const s = await framer.agent.serialize({ id: formId, depth: 2 }, { pagePath })
  const kids = s.children || []
  const existing = kids.find(
    (c) =>
      c.$componentDisplayName === "Arbour_PrimaryButton" &&
      c.attributes?.visible !== "false" &&
      c.attributes?.visible !== false
  )
  if (existing) {
    console.log(formId, "already has PrimaryButton", existing.id)
    // Align controls to Contact locked look
    const dsl = `SET ${existing.id} $control__label="SUBSCRIBE →" $control__formSubmit=true $control__variant="light" $control__fill="${RACING}" $control__text="${RACING}" $control__border="${RACING}" width="1fr" height="fit-content"`
    const r = await framer.agent.applyChanges(dsl, { pagePath })
    console.log("align", existing.id, r.message, r.errors)
    continue
  }

  const dsl = [
    `SET ${oldBtn} visible=false`,
    `+ComponentInstanceNode ${newId} component="codeFile/rB5gJ0d:default" parent="${formId}"`,
    `SET ${newId} name="Submit Button" $control__label="SUBSCRIBE →" $control__formSubmit=true $control__variant="light" $control__fill="${RACING}" $control__text="${RACING}" $control__border="${RACING}" position="relative" width="1fr" height="fit-content"`,
  ].join("; ")
  const r = await framer.agent.applyChanges(dsl, { pagePath })
  console.log(formId, r.message, r.errors)
}

// Verify all Home + Contact visible submit buttons
for (const [path, formIds] of [
  ["/", ["B3ONQd1BC", "U3TeNUVXvB3ONQd1BC", "pmAxXUJ0oB3ONQd1BC"]],
  ["/contact", ["eQW4MDduB", "qjv2S9WpaeQW4MDduB", "jEM0wBo2veQW4MDduB"]],
]) {
  for (const formId of formIds) {
    const s = await framer.agent.serialize({ id: formId, depth: 2 }, { pagePath: path })
    const visible = (s.children || []).filter(
      (c) =>
        c.$componentDisplayName &&
        c.attributes?.visible !== "false" &&
        c.attributes?.visible !== false
    )
    console.log(
      "\n",
      path,
      formId,
      visible.map((c) => ({
        id: c.id,
        disp: c.$componentDisplayName,
        label: c.attributes?.["$control__label"],
        variant: c.attributes?.["$control__variant"],
        formSubmit: c.attributes?.["$control__formSubmit"],
        text: c.attributes?.["$control__text"],
        bg: c.attributes?.["$control__background"],
      }))
    )
  }
}

const fs = require("fs")
const pagePath = "/contact"
const T = "qjv2S9Wpa"
const P = "jEM0wBo2v"
const PAPER = "var(--token-d5b3c09d-0364-4ed0-8804-e56957faa275)"
const RACING_DEEP = "var(--token-9d3d6ca5-f3ad-4d88-afc8-fc5bce03bd04)"

const proj = await framer.getProjectInfo()
if (proj.name !== "Arbour") throw new Error("wrong " + proj.name)

const file = await framer.getCodeFile("Arbour_PrimaryButton.tsx")
await file.setFileContent(fs.readFileSync(".tmp/Arbour_PrimaryButton.tsx", "utf8"))
const refreshed = (await framer.getCodeFiles()).find((f) => f.id === file.id)
console.log("typeErrors", await refreshed?.typecheck?.({ strict: true }))

// Hide old FormButton; insert PrimaryButton submit into form; wire formSubmitButtonId
async function swapSubmit(formId, oldBtnId, newId) {
  const dsl = [
    `SET ${oldBtnId} visible=false`,
    `+ComponentInstanceNode ${newId} component="codeFile/rB5gJ0d:default" parent="${formId}"`,
    `SET ${newId} name="Submit Button" $control__label="SUBSCRIBE →" $control__asSubmit=true $control__variant="dark" $control__fill="${RACING_DEEP}" $control__text="${PAPER}" position="relative" width="1fr" height="fit-content"`,
    `SET ${formId} formSubmitButtonId="${newId}"`,
  ].join("; ")
  const r = await framer.agent.applyChanges(dsl, { pagePath })
  console.log(formId, r.message, r.errors)
}

await swapSubmit("eQW4MDduB", "u2DLuU3hW", "subPrimDesk")
await swapSubmit(`${T}eQW4MDduB`, `${T}u2DLuU3hW`, "subPrimTab")
await swapSubmit(`${P}eQW4MDduB`, `${P}u2DLuU3hW`, "subPrimPho")

// Verify
for (const formId of ["eQW4MDduB", `${T}eQW4MDduB`, `${P}eQW4MDduB`]) {
  const s = await framer.agent.serialize({ id: formId, depth: 2 }, { pagePath })
  console.log(
    formId,
    "submitId",
    s.attributes?.formSubmitButtonId,
    "kids",
    (s.children || []).map((c) => ({
      id: c.id,
      name: c.name,
      disp: c.$componentDisplayName,
      vis: c.attributes?.visible,
      label: c.attributes?.["$control__label"],
      asSubmit: c.attributes?.["$control__asSubmit"],
    }))
  )
}

const pub = await framer.publish()
console.log(JSON.stringify({ id: pub.deployment?.id, status: pub.deployment?.status }))

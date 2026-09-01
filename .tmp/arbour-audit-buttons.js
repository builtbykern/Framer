const pages = await framer.getNodesWithType("WebPageNode")
const pageList = pages.map((p) => ({ id: p.id, path: p.path, name: p.name }))
console.log("pages", JSON.stringify(pageList))

const TARGET = ["Arbour_FormButton", "Arbour_PrimaryButton"]
const hits = []

function walk(n, pagePath, trail) {
  if (!n) return
  const name = n.name || ""
  const disp = n.$componentDisplayName || ""
  const comp = n.component || ""
  const isTarget =
    TARGET.includes(disp) ||
    /FormButton|PrimaryButton/i.test(disp) ||
    /FormButton|PrimaryButton/i.test(comp) ||
    (/submit|subscribe|form button/i.test(name) && n.type === "ComponentInstanceNode")
  if (isTarget) {
    const a = n.attributes || {}
    hits.push({
      pagePath,
      trail: trail.slice(-4).join(" > "),
      id: n.id,
      name,
      type: n.type,
      disp,
      comp: typeof comp === "string" ? comp.slice(0, 80) : comp,
      visible: a.visible,
      label: a["$control__label"],
      variant: a["$control__variant"],
      formSubmit: a["$control__formSubmit"] || a["$control__asSubmit"],
      fill: a["$control__fill"],
      text: a["$control__text"],
      bg: a["$control__background"],
      href: a["$control__href"],
    })
  }
  const a = n.attributes || {}
  // also note forms
  if (aHtml(n) === "form" || a.formSubmitButtonId) {
    hits.push({
      pagePath,
      kind: "form",
      id: n.id,
      name,
      formSubmitButtonId: a.formSubmitButtonId,
      htmlTag: aHtml(n),
    })
  }
  for (const c of n.children || []) walk(c, pagePath, trail.concat(name || n.id))
}

function aHtml(n) {
  return n.attributes?.htmlTag
}

for (const p of pageList) {
  if (!p.path || p.path.includes(":")) continue // skip CMS detail templates for now? include them
  try {
    const root = await framer.agent.serialize({ id: p.id, depth: 14 }, { pagePath: p.path })
    walk(root, p.path, [])
  } catch (e) {
    console.log("fail", p.path, e.message)
  }
}

// Also CMS templates
for (const p of pageList) {
  if (!p.path || !p.path.includes(":")) continue
  try {
    const root = await framer.agent.serialize({ id: p.id, depth: 14 }, { pagePath: p.path })
    walk(root, p.path, [])
  } catch (e) {
    console.log("fail", p.path, e.message)
  }
}

const buttons = hits.filter((h) => !h.kind)
const forms = hits.filter((h) => h.kind === "form")
console.log("\n=== FORMS ===")
console.log(JSON.stringify(forms, null, 2))
console.log("\n=== BUTTONS ===")
console.log(JSON.stringify(buttons, null, 2))
console.log("\ncounts", { buttons: buttons.length, forms: forms.length })

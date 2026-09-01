/**
 * UI 1+2 + Motion 1+2
 * - Fix Nav Notes label
 * - Add Nav to pages missing it
 * - Footer appearEffect: no replay, shorter tween
 * - Hamburger hover: lighter/faster
 */

const NAV_COMPONENT = "ynpqYJGOd"
const PAPER = "var(--token-d5b3c09d-0364-4ed0-8804-e56957faa275)" // unused here; UI3 deferred

const results = {}

// ——— UI 1: Notes label ———
{
  const pagePath = "/"
  // Primary TextRun under Notes link; replicas inherit unless overridden
  const noteTextRuns = [
    "v:jT50qGINg:0:0",
    "v:rL2ZHlVqgjT50qGINg:0:0",
    "v:GBmgkcS5cjT50qGINg:0:0",
    "v:WLQAqm0QzjT50qGINg:0:0",
    "v:I3SpHi24vjT50qGINg:0:0",
  ]
  // Prefer SET on RichTextNode text if TextRun ids fail
  const richIds = [
    "jT50qGINg",
    "rL2ZHlVqgjT50qGINg",
    "GBmgkcS5cjT50qGINg",
    "WLQAqm0QzjT50qGINg",
    "I3SpHi24vjT50qGINg",
  ]
  let dsl = richIds.map((id) => `SET ${id} text="Notes";`).join("\n")
  results.ui1 = await framer.agent.applyChanges(dsl, { pagePath })
}

// Verify Notes label + collect actual TextRun if still wrong
{
  const pagePath = "/"
  const n = await framer.agent.serialize(
    { id: "a1U8tOWJM", depth: 5, attributeFilter: ["name", "text", "link"] },
    { pagePath }
  )
  function texts(node, acc = []) {
    if (node.attributes?.text) acc.push({ id: node.id, text: node.attributes.text })
    for (const c of node.children || []) texts(c, acc)
    return acc
  }
  results.ui1Verify = texts(n)
  if (results.ui1Verify.some((t) => t.text === "Neighbourhoods")) {
    // Force TextRun ids discovered
    const dsl = results.ui1Verify
      .filter((t) => t.text === "Neighbourhoods")
      .map((t) => `SET ${t.id} text="Notes";`)
      .join("\n")
    results.ui1Retry = await framer.agent.applyChanges(dsl, { pagePath })
    const n2 = await framer.agent.serialize(
      { id: "a1U8tOWJM", depth: 5, attributeFilter: ["text"] },
      { pagePath }
    )
    results.ui1Verify2 = texts(n2)
  }
}

// ——— UI 2: Insert Nav ———
const navInserts = [
  {
    pagePath: "/properties-2",
    items: [
      { id: "navP2Desk", parent: "obfRB9jeb", position: "3" },
      { id: "navP2Tab", parent: "SScKalu3B", position: "3" },
      { id: "navP2Phone", parent: "EK6d5SyWL", position: "3" },
    ],
  },
  {
    pagePath: "/notes",
    items: [
      { id: "navNotesDesk", parent: "T4DtVCP3y", position: "0" },
      { id: "navNotesTab", parent: "LptqEiXVp", position: "0" },
      { id: "navNotesPhone", parent: "INUKgvAna", position: "0" },
    ],
  },
  {
    pagePath: "/about",
    items: [
      { id: "navAboutDesk", parent: "hd9EqB_ax", position: "0" },
      { id: "navAboutTab", parent: "xvqDXw58e", position: "0" },
      { id: "navAboutPhone", parent: "CYNrpU04t", position: "0" },
    ],
  },
  {
    pagePath: "/contact",
    items: [
      { id: "navContactDesk", parent: "eSIn17Npa", position: "0" },
      { id: "navContactTab", parent: "qjv2S9Wpa", position: "0" },
      { id: "navContactPhone", parent: "jEM0wBo2v", position: "0" },
    ],
  },
  {
    pagePath: "/neighbourhoods",
    items: [
      { id: "navNbDesk", parent: "LmDrAnCZU", position: "0" },
      { id: "navNbTab", parent: "aJLpuUP0q", position: "0" },
      { id: "navNbPhone", parent: "Qonafp_oD", position: "0" },
    ],
  },
]

results.ui2 = []
for (const page of navInserts) {
  // Skip if already has Nav
  const nodes = await framer.agent.getDescendantsOfTypes(
    { id: page.items[0].parent, types: ["ComponentInstanceNode"] },
    { pagePath: page.pagePath }
  )
  // Check page root instead
  const roots = {
    "/properties-2": "uBAGmujMa",
    "/notes": "s8RpZIiJ8",
    "/about": "OdFhPn9yz",
    "/contact": "c7qpzB7hR",
    "/neighbourhoods": "dZfxmFpqB",
  }
  const all = await framer.agent.getDescendantsOfTypes(
    { id: roots[page.pagePath], types: ["ComponentInstanceNode"] },
    { pagePath: page.pagePath }
  )
  if ((all || []).some((n) => n.$componentDisplayName === "Nav")) {
    results.ui2.push({ pagePath: page.pagePath, skipped: "already has Nav" })
    continue
  }

  const dsl = page.items
    .map(
      (it) =>
        `+ComponentInstanceNode ${it.id} parent="${it.parent}" position="${it.position}" component="${NAV_COMPONENT}"; SET ${it.id} name="Nav" position="sticky" top="0px" width="1fr" height="auto" zIndex="10";`
    )
    .join("\n")
  const r = await framer.agent.applyChanges(dsl, { pagePath: page.pagePath })
  results.ui2.push({ pagePath: page.pagePath, result: r })
}

// ——— Motion 1: Footer appear ———
const footers = [
  { pagePath: "/", ids: ["GYfGDq3cB", "U3TeNUVXvGYfGDq3cB", "pmAxXUJ0oGYfGDq3cB"] },
  {
    pagePath: "/properties-2",
    ids: ["wssGwbNHc", "SScKalu3BwssGwbNHc", "EK6d5SyWLwssGwbNHc"],
  },
  {
    pagePath: "/notes",
    ids: ["w2XzAbdoF", "LptqEiXVpw2XzAbdoF", "INUKgvAnaw2XzAbdoF"],
  },
  {
    pagePath: "/about",
    ids: ["EnLRF_D_f", "xvqDXw58eEnLRF_D_f", "CYNrpU04tEnLRF_D_f"],
  },
  {
    pagePath: "/contact",
    ids: ["R1UwW27g3", "qjv2S9WpaR1UwW27g3", "jEM0wBo2vR1UwW27g3"],
  },
  {
    pagePath: "/neighbourhoods",
    ids: ["DRglThXCl", "aJLpuUP0qDRglThXCl", "Qonafp_oDDRglThXCl"],
  },
  {
    pagePath: "/properties-2/:Properties",
    ids: ["CIYq_FTjP", "IQmBTrFpbCIYq_FTjP", "MrTKJzwELCIYq_FTjP"],
  },
]

results.motion1 = []
for (const page of footers) {
  const dsl = page.ids
    .map(
      (id) =>
        `SET ${id} appearEffect.trigger="onInView" appearEffect.threshold="0.15" appearEffect.replay="false" appearEffect.enter.opacity="0" appearEffect.enter.y="16" appearEffect.enter.x="0" appearEffect.enter.scale="1" appearEffect.enter.transition="tween 0.23,1,0.32,1 0.4s 0s";`
    )
    .join("\n")
  const r = await framer.agent.applyChanges(dsl, { pagePath: page.pagePath })
  results.motion1.push({ pagePath: page.pagePath, result: r })
}

// ——— Motion 2: Hamburger hover ———
{
  const pagePath = "/"
  const hamIds = [
    "fnivAiNkl",
    "I3SpHi24vfnivAiNkl",
    "rL2ZHlVqgfnivAiNkl",
    "GBmgkcS5cfnivAiNkl",
    "WLQAqm0QzfnivAiNkl",
  ]
  const dsl = hamIds
    .map(
      (id) =>
        `SET ${id} hoverEffect.opacity="1" hoverEffect.x="0px" hoverEffect.y="0px" hoverEffect.scale="1.02" hoverEffect.rotate="0deg" hoverEffect.skewX="0deg" hoverEffect.skewY="0deg" hoverEffect.transition="tween 0.23,1,0.32,1 0.16s 0s";`
    )
    .join("\n")
  results.motion2 = await framer.agent.applyChanges(dsl, { pagePath })
}

// ——— Verify ———
const verify = {}
{
  const pagePath = "/"
  const notes = await framer.agent.serialize(
    { id: "a1U8tOWJM", depth: 5, attributeFilter: ["text"] },
    { pagePath }
  )
  function flatText(n, acc = []) {
    if (n.attributes?.text) acc.push(n.attributes.text)
    for (const c of n.children || []) flatText(c, acc)
    return acc
  }
  verify.notesLabel = flatText(notes)

  const ham = await framer.agent.serialize(
    { id: "fnivAiNkl", depth: 0, attributeFilter: ["hoverEffect"] },
    { pagePath }
  )
  verify.hamburgerHover = ham.attributes?.hoverEffect

  const foot = await framer.agent.serialize(
    { id: "wssGwbNHc", depth: 0, attributeFilter: ["appearEffect"] },
    { pagePath: "/properties-2" }
  )
  verify.footerAppear = foot.attributes?.appearEffect
}

verify.navPresence = {}
for (const [path, root] of Object.entries({
  "/properties-2": "uBAGmujMa",
  "/notes": "s8RpZIiJ8",
  "/about": "OdFhPn9yz",
  "/contact": "c7qpzB7hR",
  "/neighbourhoods": "dZfxmFpqB",
})) {
  const nodes = await framer.agent.getDescendantsOfTypes(
    { id: root, types: ["ComponentInstanceNode"] },
    { pagePath: path }
  )
  verify.navPresence[path] = (nodes || []).some(
    (n) => n.$componentDisplayName === "Nav"
  )
}

console.log(JSON.stringify({ results, verify }, null, 2))

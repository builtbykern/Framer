/**
 * 1) Fix Notes typography + hover to match sibling nav links
 * 2) Create Desktop - Open from Desktop, style like Tablet - Open
 * 3) Wire Desktop menu icons to Desktop Close/Open (stop jumping to tablet variants)
 */

const pagePath = "/"
const PAPER = "var(--token-d5b3c09d-0364-4ed0-8804-e56957faa275)"
const INK = "var(--token-e2f9a9eb-668a-4021-80d9-b04413b5f392)"
const DESK_CLOSE = "YrKq9_bDB"
const TAB_OPEN = "rL2ZHlVqg"
const TAB_CLOSE = "I3SpHi24v"

const out = {}

// ——— 1. Notes style (overrides on tablet/phone) ———
const notesRich = [
  "rL2ZHlVqgjT50qGINg", // tablet open
  "I3SpHi24vjT50qGINg", // tablet close
  "WLQAqm0QzjT50qGINg", // phone open
  "GBmgkcS5cjT50qGINg", // phone close
]
const notesFrames = [
  "rL2ZHlVqga1U8tOWJM",
  "I3SpHi24va1U8tOWJM",
  "WLQAqm0Qza1U8tOWJM",
  "GBmgkcS5ca1U8tOWJM",
  "a1U8tOWJM", // desktop — align hover to tablet open siblings later
]

let notesDsl = notesRich
  .map(
    (id) =>
      `SET ${id} textStylePreset="Arbour/Subhead" textColor="${INK}" fontName="Fraunces" fontSize="21px";`
  )
  .join("\n")

// Match tablet-open sibling hover (scale 1, x 8px) on Notes everywhere including desktop
notesDsl +=
  "\n" +
  notesFrames
    .map(
      (id) =>
        `SET ${id} hoverEffect.opacity="1" hoverEffect.x="8px" hoverEffect.y="0px" hoverEffect.scale="1" hoverEffect.rotate="0deg" hoverEffect.skewX="0deg" hoverEffect.skewY="0deg" hoverEffect.transition="tween 0.23,1,0.32,1 0.18s 0s";`
    )
    .join("\n")

// Align other Desktop nav link hovers to tablet style
const deskLinks = ["nX0lfjBMF", "OJv0_ap3Q", "a1U8tOWJM", "Cqew9nSeY", "vgHc6ZCze"]
notesDsl +=
  "\n" +
  deskLinks
    .map(
      (id) =>
        `SET ${id} hoverEffect.opacity="1" hoverEffect.x="8px" hoverEffect.y="0px" hoverEffect.scale="1" hoverEffect.rotate="0deg" hoverEffect.skewX="0deg" hoverEffect.skewY="0deg" hoverEffect.transition="tween 0.23,1,0.32,1 0.18s 0s";`
    )
    .join("\n")

out.notes = await framer.agent.applyChanges(notesDsl, { pagePath })

// Fix TextBlock tags to h3 where Notes used p
const tagDsl = [
  "v:rL2ZHlVqgjT50qGINg:0",
  "v:I3SpHi24vjT50qGINg:0",
  "v:WLQAqm0QzjT50qGINg:0",
  "v:GBmgkcS5cjT50qGINg:0",
]
  .map((id) => `SET ${id} tag="h3";`)
  .join("\n")
out.notesTags = await framer.agent.applyChanges(tagDsl, { pagePath })

// ——— 2. Create Desktop - Open ———
out.createOpen = await framer.agent.applyChanges(
  `CREATE_VARIANT deskOpen from="${DESK_CLOSE}";`,
  { pagePath }
)

const deskOpen =
  out.createOpen?.renamedIds?.deskOpen ||
  out.createOpen?.createdNodes?.deskOpen ||
  "deskOpen"

// Resolve actual id from component children if renamed
const navRoot = await framer.agent.serialize(
  { id: "ynpqYJGOd", depth: 1, attributeFilter: ["name", "width"] },
  { pagePath }
)
const openVariant = (navRoot.children || []).find((c) =>
  /Desktop.*Open|deskOpen/i.test(c.name || c.id)
)
const OPEN_ID = openVariant?.id || deskOpen

out.openId = OPEN_ID
out.variants = (navRoot.children || []).map((c) => c.id + " " + c.name)

// Style Desktop - Open like Tablet - Open
const openDsl = `
SET ${OPEN_ID} name="Desktop - Open" width="1200px" height="auto" fill="${PAPER}" gap="0px" layout="stack" stackDirection="vertical";
SET ${OPEN_ID}sxhzAXUR_ height="auto" fill="${PAPER}" width="1fr";
SET ${OPEN_ID}hTjpCrIL4 fill="${PAPER}" padding="80px 40px 40px 40px" width="1fr" height="auto" visible="true";
SET ${OPEN_ID}Wxy35MQ3M width="1fr" height="auto";
SET ${OPEN_ID}jNQ3It8lt width="40%" height="auto";
SET ${OPEN_ID}OyIw8XozC width="1fr" height="auto" padding="0px";
SET ${OPEN_ID}PFKQwmSQS width="1fr" height="auto" padding="24px 0px 0px 0px";
SET ${OPEN_ID}EJPuaSmlO padding="16px 48px 16px 48px" fill="${PAPER}";
`

out.styleOpen = await framer.agent.applyChanges(openDsl, { pagePath })

// Also update Desktop closed drawer base to Paper so open morph is consistent
// Keep container h=0 on closed (already). Soften closed drawer fill to Paper like open (clipped anyway).
out.styleCloseDrawer = await framer.agent.applyChanges(
  `
SET hTjpCrIL4 fill="${PAPER}" padding="80px 40px 40px 40px" height="1fr";
SET Wxy35MQ3M height="1fr";
SET OyIw8XozC padding="0px";
SET PFKQwmSQS padding="24px 0px 0px 0px";
`,
  { pagePath }
)

// ——— 3. Wire Desktop icons ———
// Desktop Close: show menu icon KXU → open Desktop Open; hide tmJA (X/open-state icon)
// Desktop Open: show tmJA open=true → close Desktop; hide KXU
const wireDsl = `
SET tmJAAugFF visible="false" opacity="0" $control__open="false" onToggle.0.action="SET_VARIANT" onToggle.0.controls.variant="${OPEN_ID}";
SET KXUslQmE1 visible="true" opacity="1" $control__open="false" onToggle.0.action="SET_VARIANT" onToggle.0.controls.variant="${OPEN_ID}";
SET ${OPEN_ID}tmJAAugFF visible="true" opacity="1" $control__open="true" onToggle.0.action="SET_VARIANT" onToggle.0.controls.variant="${DESK_CLOSE}";
SET ${OPEN_ID}KXUslQmE1 visible="false" opacity="0" $control__open="false";
`

out.wire = await framer.agent.applyChanges(wireDsl, { pagePath })

// Align Desktop-Open link hovers to tablet
const openLinkIds = ["nX0lfjBMF", "OJv0_ap3Q", "a1U8tOWJM", "Cqew9nSeY", "vgHc6ZCze"].map(
  (id) => `${OPEN_ID}${id}`
)
const openHoverDsl = openLinkIds
  .map(
    (id) =>
      `SET ${id} hoverEffect.opacity="1" hoverEffect.x="8px" hoverEffect.y="0px" hoverEffect.scale="1" hoverEffect.rotate="0deg" hoverEffect.skewX="0deg" hoverEffect.skewY="0deg" hoverEffect.transition="tween 0.23,1,0.32,1 0.18s 0s";`
  )
  .join("\n")
out.openHover = await framer.agent.applyChanges(openHoverDsl, { pagePath })

// Fix Notes rich text on Desktop-Open replica if it inherited Inter somehow
out.openNotes = await framer.agent.applyChanges(
  `
SET ${OPEN_ID}jT50qGINg textStylePreset="Arbour/Subhead" textColor="${INK}";
SET ${OPEN_ID}a1U8tOWJM hoverEffect.opacity="1" hoverEffect.x="8px" hoverEffect.y="0px" hoverEffect.scale="1" hoverEffect.rotate="0deg" hoverEffect.skewX="0deg" hoverEffect.skewY="0deg" hoverEffect.transition="tween 0.23,1,0.32,1 0.18s 0s";
`,
  { pagePath }
)

// ——— Verify ———
const verify = {}
verify.variants = (
  await framer.agent.serialize(
    { id: "ynpqYJGOd", depth: 1, attributeFilter: ["name", "width"] },
    { pagePath }
  )
).children?.map((c) => ({ id: c.id, name: c.name, w: c.attributes?.width }))

const notesCheck = await framer.agent.serialize(
  { id: "rL2ZHlVqgjT50qGINg", depth: 0, attributeFilter: ["textStylePreset", "fontName", "fontSize", "textColor"] },
  { pagePath }
)
verify.tabNotesRich = notesCheck.attributes

const openDrawer = await framer.agent.serialize(
  { id: `${OPEN_ID}hTjpCrIL4`, depth: 0, attributeFilter: ["fill", "padding", "height"] },
  { pagePath }
)
verify.openDrawer = openDrawer.attributes

const deskIcon = await framer.agent.serialize(
  { id: "KXUslQmE1", depth: 0, attributeFilter: ["visible", "onToggle", "$control__open"] },
  { pagePath }
)
verify.deskMenuIcon = deskIcon.attributes

console.log(JSON.stringify({ out, verify }, null, 2))

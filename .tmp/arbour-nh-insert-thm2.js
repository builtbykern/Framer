const codeId = "nMMl08t"
// confirm file
const files = await framer.getCodeFiles()
const file = files.find((f) => f.id === codeId) || files.find((f) => /TerritoryHoverMedia/i.test(f.name || ""))
console.log("file", file && { id: file.id, name: file.name, len: file.content?.length })

const HERO = "var(--variable-dM8yn13g7)"
const MAP = "var(--variable-ppzgDk7Mi)"
const CHARTREUSE = "var(--token-db86917b-d19e-4fd7-8dc5-e260f1f35cb1)"

const slots = [
  { photo: "hX5NduSNi", tag: "thmD" },
  { photo: "aJLpuUP0qhX5NduSNi", tag: "thmT" },
  { photo: "Qonafp_oDhX5NduSNi", tag: "thmP" },
]

// cleanup any orphan pending names
const page = (await framer.getNodesWithType("WebPageNode")).find((p) => p.path === "/neighbourhoods")
const tree = await framer.agent.serialize({ id: page.id, depth: 18 }, {})
const existing = []
function walk(n) {
  if (!n) return
  if (/TerritoryHoverMedia/i.test(n.name || "") || String(n.component || "").includes(file?.id || codeId)) {
    existing.push(n.id)
  }
  for (const c of n.children || []) walk(c)
  for (const b of n.$breakpoints || []) walk(b)
}
walk(tree)

const cmds = []
for (const id of existing) cmds.push(`DEL ${id}`)

for (const s of slots) {
  cmds.push(`+ComponentInstanceNode ${s.tag} parent="${s.photo}" component="codeFile/${file.id}:default"`)
  cmds.push(
    `SET ${s.tag} name="Arbour_TerritoryHoverMedia" position="absolute" top="0px" left="0px" width="100%" height="100%" $control__image=${HERO} $control__imageB=${MAP} $control__intervalMs=900 $control__zoom=1.04 $control__showView=true $control__viewLabel="VIEW →" $control__accent=${CHARTREUSE}`
  )
}

const res = await framer.agent.applyChanges(cmds.join(";\n"), { pagePath: "/neighbourhoods" })
const photo = await framer.agent.serialize({ id: "hX5NduSNi", depth: 3 }, {})
const card = await framer.agent.serialize({ id: "i56eWdACt", depth: 2 }, {})

console.log(
  JSON.stringify(
    {
      cleaned: existing,
      message: res?.message,
      errors: res?.errors,
      photoH: photo.attributes?.height,
      photoChildren: (photo.children || []).map((c) => ({
        id: c.id,
        name: c.name,
        component: c.component,
        image: c.attributes?.["$control__image"],
        imageB: c.attributes?.["$control__imageB"],
      })),
      cardOrder: (card.children || []).map((c) => c.name),
      cardBorder: card.attributes?.border,
    },
    null,
    2
  )
)

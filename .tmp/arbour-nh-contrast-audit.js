const CHARTREUSE = "var(--token-db86917b-d19e-4fd7-8dc5-e260f1f35cb1)"
const PAPER = "var(--token-d5b3c09d-0364-4ed0-8804-e56957faa275)"
const INK = "var(--token-e2f9a9eb-668a-4021-80d9-b04413b5f392)"
const INK_SOFT = "var(--token-0bc68d0d-4c0b-4126-8cce-9425cb153f4e)"

// Resolve color styles if available
let styles = []
try {
  styles = await framer.getColorStyles?.() || []
} catch {}
const colorish = (styles || [])
  .filter((s) => /paper|ink|olive|chartreuse|racing/i.test(s.name || ""))
  .map((s) => ({ name: s.name, id: s.id, light: s.light, dark: s.dark }))

const nodes = {
  title: "rie14TaT9",
  view: "d9SNjsdke",
  intro: "v61cPV2xF",
  dossier: "QAa2V2fag",
  titleRow: "Ltp8ot_zm",
  card: "i56eWdACt",
}

const desktop = {}
for (const [k, id] of Object.entries(nodes)) {
  const n = await framer.agent.serialize({ id, depth: 2 }, { pagePath: "/neighbourhoods" })
  const a = n.attributes || {}
  desktop[k] = {
    id,
    name: n.name,
    visible: a.visible,
    pad: a.padding,
    gap: a.gap,
    h: a.height,
    w: a.width,
    color: a.textColor,
    bg: a.backgroundColor,
    border: a.border,
    preset: a.textStylePreset,
    align: a.textAlignment,
    trunc: a.textTruncation,
    dir: a.stackDirection,
    dist: a.stackDistribution,
    fontSize: a.fontSize,
    letterSpacing: a.letterSpacing,
  }
}

// Breakpoint replicas
const bps = [
  { label: "T", prefix: "aJLpuUP0q" },
  { label: "P", prefix: "Qonafp_oD" },
]
const replicas = {}
for (const { label, prefix } of bps) {
  replicas[label] = {}
  for (const [k, id] of Object.entries(nodes)) {
    const rid = prefix + id
    try {
      const n = await framer.agent.serialize({ id: rid, depth: 1 }, {})
      const a = n.attributes || {}
      replicas[label][k] = {
        pad: a.padding,
        gap: a.gap,
        color: a.textColor,
        bg: a.backgroundColor,
        visible: a.visible,
        trunc: a.textTruncation,
        preset: a.textStylePreset,
        dist: a.stackDistribution,
        w: a.width,
        h: a.height,
      }
    } catch (e) {
      replicas[label][k] = { error: String(e.message || e) }
    }
  }
}

// PropertyCard VIEW color context snippet
const pc = (await framer.getCodeFiles()).find((f) => f.name === "Arbour_PropertyCard.tsx")
const pcContent = pc?.content || ""
const accentMatch = pcContent.match(/accent[^\n]{0,80}/g)?.slice(0, 8)

console.log(
  JSON.stringify(
    { colorish, desktop, replicas, accentMatch },
    null,
    2
  )
)

const OLIVE = "var(--token-a16d0333-6bd5-4d60-aa00-fac26447145d)"
const INK = "var(--token-e2f9a9eb-668a-4021-80d9-b04413b5f392)"
const INK_60 = "var(--token-cf5bf9af-72f6-4da6-ad12-b9daaa07387b)"
const PAPER = "var(--token-d5b3c09d-0364-4ed0-8804-e56957faa275)"
const HAIRLINE = "1px solid rgba(28, 27, 22, 0.10)"

const viewCtas = ["d9SNjsdke", "aJLpuUP0qd9SNjsdke", "Qonafp_oDd9SNjsdke"]
const titles = ["rie14TaT9", "aJLpuUP0qrie14TaT9", "Qonafp_oDrie14TaT9"]
const intros = ["v61cPV2xF", "aJLpuUP0qv61cPV2xF", "Qonafp_oDv61cPV2xF"]
const titleRows = ["Ltp8ot_zm", "aJLpuUP0qLtp8ot_zm", "Qonafp_oDLtp8ot_zm"]
const medias = ["z2kRrpzAZ", "aJLpuUP0qz2kRrpzAZ", "Qonafp_oDz2kRrpzAZ"]

const cmds = []

// Contrast + coherence: Meta VIEW on Paper → Olive (Chartreuse is for dark media)
for (const id of viewCtas) {
  cmds.push(
    `SET ${id} visible="true" textColor="${OLIVE}" textStylePreset="Arbour/Meta" textAlignment="end" width="auto"`
  )
}

// Title stays Ink Subhead
for (const id of titles) {
  cmds.push(`SET ${id} textColor="${INK}" textStylePreset="Arbour/Subhead" textAlignment="start" width="1fr"`)
}

// Body on Paper: Ink 60 (~4.5:1) instead of Ink Soft 0.55 (~3.8)
for (const id of intros) {
  cmds.push(`SET ${id} textColor="${INK_60}" textStylePreset="Arbour/Body" textTruncation="4"`)
}

// Title row structure (no gap — space-between)
for (const id of titleRows) {
  cmds.push(
    `SET ${id} stackDirection="horizontal" stackDistribution="space-between" stackAlignment="center" width="1fr"`
  )
}

// Media overlay VIEW stays off
for (const id of medias) {
  cmds.push(`SET ${id} $control__showView="false"`)
}

// Dossier: Paper + hairline; air — then BP-tuned padding
cmds.push(
  `SET QAa2V2fag backgroundColor="${PAPER}" border="${HAIRLINE}" padding="28px 28px 52px 28px" gap="16px" stackDistribution="start"`
)
cmds.push(
  `SET aJLpuUP0qQAa2V2fag backgroundColor="${PAPER}" border="${HAIRLINE}" padding="24px 24px 48px 24px" gap="14px" stackDistribution="start"`
)
cmds.push(
  `SET Qonafp_oDQAa2V2fag backgroundColor="${PAPER}" border="${HAIRLINE}" padding="20px 20px 44px 20px" gap="12px" stackDistribution="start"`
)

const res = await framer.agent.applyChanges(cmds.join(";\n"), {
  pagePath: "/neighbourhoods",
})

const check = {}
for (const [label, id] of [
  ["viewD", "d9SNjsdke"],
  ["viewT", "aJLpuUP0qd9SNjsdke"],
  ["viewP", "Qonafp_oDd9SNjsdke"],
  ["introD", "v61cPV2xF"],
  ["dossierD", "QAa2V2fag"],
  ["dossierT", "aJLpuUP0qQAa2V2fag"],
  ["dossierP", "Qonafp_oDQAa2V2fag"],
  ["media", "z2kRrpzAZ"],
]) {
  const n = await framer.agent.serialize({ id }, {})
  const a = n.attributes || {}
  check[label] = {
    color: a.textColor,
    pad: a.padding,
    border: a.border,
    showView: a.$control__showView,
    trunc: a.textTruncation,
  }
}

console.log(
  JSON.stringify({ message: res?.message, errors: res?.errors, check }, null, 2)
)

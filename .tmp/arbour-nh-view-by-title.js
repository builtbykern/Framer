const CHARTREUSE = "var(--token-db86917b-d19e-4fd7-8dc5-e260f1f35cb1)"
const PAPER = "var(--token-d5b3c09d-0364-4ed0-8804-e56957faa275)"
const INK_SOFT = "var(--token-0bc68d0d-4c0b-4126-8cce-9425cb153f4e)"

const viewCtas = ["d9SNjsdke", "aJLpuUP0qd9SNjsdke", "Qonafp_oDd9SNjsdke"]
const medias = ["z2kRrpzAZ", "aJLpuUP0qz2kRrpzAZ", "Qonafp_oDz2kRrpzAZ"]
const dossiers = ["QAa2V2fag", "aJLpuUP0qQAa2V2fag", "Qonafp_oDQAa2V2fag"]
const titles = ["Ltp8ot_zm", "aJLpuUP0qLtp8ot_zm", "Qonafp_oDLtp8ot_zm"]
const intros = ["v61cPV2xF", "aJLpuUP0qv61cPV2xF", "Qonafp_oDv61cPV2xF"]

const cmds = []

// VIEW beside title (right), Chartreuse Meta
for (const id of viewCtas) {
  cmds.push(
    `SET ${id} visible="true" textColor="${CHARTREUSE}" textStylePreset="Arbour/Meta" textAlignment="end" width="auto"`
  )
}

// Title row: name left, VIEW right
for (const id of titles) {
  cmds.push(
    `SET ${id} stackDirection="horizontal" stackDistribution="space-between" stackAlignment="center" gap="16px" width="1fr"`
  )
}

// Kill overlay VIEW on media — dossier owns the cue
for (const id of medias) {
  cmds.push(`SET ${id} $control__showView="false"`)
}

// More air in dossier + room for intro (less aggressive clamp)
cmds.push(
  `SET QAa2V2fag padding="28px 28px 52px 28px" gap="16px" backgroundColor="${PAPER}" border="0px"`
)
cmds.push(
  `SET aJLpuUP0qQAa2V2fag padding="24px 24px 48px 24px" gap="14px" backgroundColor="${PAPER}" border="0px"`
)
cmds.push(
  `SET Qonafp_oDQAa2V2fag padding="22px 20px 48px 20px" gap="12px" backgroundColor="${PAPER}" border="0px"`
)

for (const id of intros) {
  cmds.push(`SET ${id} textTruncation="4" textColor="${INK_SOFT}"`)
}

const res = await framer.agent.applyChanges(cmds.join(";\n"), {
  pagePath: "/neighbourhoods",
})

const view = await framer.agent.serialize({ id: "d9SNjsdke", depth: 1 }, {})
const dossier = await framer.agent.serialize({ id: "QAa2V2fag", depth: 1 }, {})
const intro = await framer.agent.serialize({ id: "v61cPV2xF", depth: 1 }, {})
const media = await framer.agent.serialize({ id: "z2kRrpzAZ", depth: 1 }, {})
const title = await framer.agent.serialize({ id: "Ltp8ot_zm", depth: 1 }, {})

console.log(
  JSON.stringify(
    {
      message: res?.message,
      errors: res?.errors,
      viewVisible: view.attributes?.visible,
      viewColor: view.attributes?.textColor,
      titleDist: title.attributes?.stackDistribution,
      dossierPad: dossier.attributes?.padding,
      dossierGap: dossier.attributes?.gap,
      introTrunc: intro.attributes?.textTruncation,
      mediaShowView: media.attributes?.$control__showView,
    },
    null,
    2
  )
)

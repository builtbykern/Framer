const pagePath = "/neighbourhoods"
const card = "i56eWdACt"
const dossier = "QAa2V2fag"
const photo = "pk4EKsdIR"

// Re-assert primary order first
let changes = [
  { type: "setParent", nodeId: photo, value: card, index: 0 },
  { type: "setParent", nodeId: dossier, value: card, index: 1 },
]

const r1 = await framer.agent.applyChanges({ changes, pagePath, dryRun: false })
console.log("order", JSON.stringify({ failed: r1.failed, applied: r1.applied?.length }))

// Try setParent on BP replicas directly
changes = [
  {
    type: "setParent",
    nodeId: "aJLpuUP0qpk4EKsdIR",
    value: "aJLpuUP0qi56eWdACt",
    index: 0,
  },
  {
    type: "setParent",
    nodeId: "aJLpuUP0qQAa2V2fag",
    value: "aJLpuUP0qi56eWdACt",
    index: 1,
  },
  {
    type: "setParent",
    nodeId: "Qonafp_oDpk4EKsdIR",
    value: "Qonafp_oDi56eWdACt",
    index: 0,
  },
  {
    type: "setParent",
    nodeId: "Qonafp_oDQAa2V2fag",
    value: "Qonafp_oDi56eWdACt",
    index: 1,
  },
]

const r2 = await framer.agent.applyChanges({ changes, pagePath, dryRun: false })
console.log("bpOrder", JSON.stringify({ failed: r2.failed, applied: r2.applied?.length }))

changes = [
  {
    type: "editNode",
    nodeId: "aJLpuUP0qi56eWdACt",
    patch: { padding: "0px", gap: "0px" },
  },
  {
    type: "editNode",
    nodeId: "Qonafp_oDi56eWdACt",
    patch: { padding: "0px", gap: "0px" },
  },
  {
    type: "editNode",
    nodeId: "aJLpuUP0qpk4EKsdIR",
    patch: {
      visible: true,
      position: "relative",
      width: "1fr",
      height: "300px",
      overflow: "hidden",
      fill: "var(--variable-dM8yn13g7)",
      top: "0px",
      left: "0px",
      right: "0px",
      bottom: "auto",
    },
  },
  {
    type: "editNode",
    nodeId: "Qonafp_oDpk4EKsdIR",
    patch: {
      visible: true,
      position: "relative",
      width: "1fr",
      height: "260px",
      overflow: "hidden",
      fill: "var(--variable-dM8yn13g7)",
      top: "0px",
      left: "0px",
      right: "0px",
      bottom: "auto",
    },
  },
  {
    type: "editNode",
    nodeId: "aJLpuUP0qBDQcZz5ik",
    patch: { visible: false },
  },
  {
    type: "editNode",
    nodeId: "Qonafp_oDBDQcZz5ik",
    patch: { visible: false },
  },
]

const r3 = await framer.agent.applyChanges({ changes, pagePath, dryRun: false })
console.log("layout", JSON.stringify({ failed: r3.failed, applied: r3.applied?.length }))

const afterT = await framer.agent.serialize(
  { id: "aJLpuUP0qi56eWdACt", depth: 1 },
  { pagePath }
)
const afterP = await framer.agent.serialize(
  { id: "Qonafp_oDi56eWdACt", depth: 1 },
  { pagePath }
)
console.log(
  JSON.stringify(
    {
      T: {
        pad: afterT.attributes?.padding,
        kids: (afterT.children || []).map((c) => ({
          id: c.id,
          name: c.name,
          pos: c.attributes?.position,
          h: c.attributes?.height,
          fill: !!c.attributes?.fill,
        })),
      },
      P: {
        pad: afterP.attributes?.padding,
        kids: (afterP.children || []).map((c) => ({
          id: c.id,
          name: c.name,
          pos: c.attributes?.position,
          h: c.attributes?.height,
          fill: !!c.attributes?.fill,
        })),
      },
    },
    null,
    2
  )
)

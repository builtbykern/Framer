const INST_ID = "OF2RSF8jM"
const nodes = await framer.getNodesWithType("ComponentInstanceNode")
const node = nodes.find((n) => n.id === INST_ID)
if (!node || typeof node.setAttributes !== "function") {
  throw new Error("Home Kinetic Grid instance not found")
}
const prev = node.controls || {}
await node.setAttributes({
  controls: {
    ...prev,
    interaction: {
      ...(prev.interaction || {}),
      enabled: true,
      touchCapture: true,
      neighborBleed: prev.interaction?.neighborBleed ?? 0.05,
      performanceMode: false,
    },
    entrance: {
      ...(prev.entrance || {}),
      enabled: true,
      staggerDelay: 0.04,
    },
  },
})
const after = (await framer.getNodesWithType("ComponentInstanceNode")).find(
  (n) => n.id === INST_ID,
)
console.log(
  JSON.stringify(
    {
      ok: true,
      id: INST_ID,
      performanceMode: after?.controls?.interaction?.performanceMode,
      staggerDelay: after?.controls?.entrance?.staggerDelay,
    },
    null,
    2,
  ),
)

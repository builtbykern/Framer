const list = await framer.agent.getNode({ id: "H9TnltXVB" }, { pagePath: "/" })
const a = list.attributes || {}
console.log(JSON.stringify({
  name: list.name,
  layout: a.layout,
  gap: a.gap,
  stackDirection: a.stackDirection,
  width: a.width,
  overflow: a.overflow,
}))

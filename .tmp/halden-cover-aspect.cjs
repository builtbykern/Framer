const cover = await framer.agent.getNode({ id: "nt9Gs3MMs" }, { pagePath: "/" })
const a = cover.attributes || {}
console.log(JSON.stringify({
  position: a.position,
  width: a.width,
  height: a.height,
  aspectRatio: a.aspectRatio,
}))

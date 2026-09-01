const pagePath = "/contact"
const PAPER = "var(--token-d5b3c09d-0364-4ed0-8804-e56957faa275)"

const proj = await framer.getProjectInfo()
if (proj.name !== "Arbour") throw new Error("wrong " + proj.name)

// Kill lamentable gradient. Solid Paper plane only — deluxe cut, not soft fade.
const dsl = [
  `SET smzXd5qNf width="42%" left="0px" top="0px" bottom="0px" zIndex=2 visible=true fill="${PAPER}"`,
  `SET qjv2S9WpasmzXd5qNf width="40%" left="0px" top="0px" bottom="0px" visible=true fill="${PAPER}"`,
  `SET jEM0wBo2vsmzXd5qNf visible=false`,
  // Keep punch type; no blend/stroke injector
  `SET e5xcrxKTw visible=false`,
  `SET qjv2S9Wpae5xcrxKTw visible=false`,
  `SET jEM0wBo2ve5xcrxKTw visible=false`,
].join("; ")

const r = await framer.agent.applyChanges(dsl, { pagePath })
console.log(JSON.stringify({ msg: r.message, errors: r.errors }))

const wash = await framer.getNode("smzXd5qNf")
console.log(
  JSON.stringify({
    w: wash.width,
    bg: wash.backgroundColor,
    g: wash.backgroundGradient,
  })
)

// If gradient still lingering, force-clear via setAttributes
if (wash.backgroundGradient) {
  await framer.setAttributes("smzXd5qNf", {
    backgroundGradient: null,
    backgroundColor: PAPER,
    width: "42%",
  })
  await framer.setAttributes("qjv2S9WpasmzXd5qNf", {
    backgroundGradient: null,
    backgroundColor: PAPER,
    width: "40%",
  })
  const again = await framer.getNode("smzXd5qNf")
  console.log(
    "cleared",
    JSON.stringify({ w: again.width, bg: again.backgroundColor, g: again.backgroundGradient })
  )
}

const res = await framer.publish()
console.log(JSON.stringify({ id: res.deployment?.id, status: res.deployment?.status }))

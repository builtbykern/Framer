const fs = require("fs")

const shotD = await framer.screenshot("i56eWdACt", { format: "png", scale: 1 })
fs.writeFileSync(".tmp/arbour-nh-card-D.png", shotD.data)
console.log("D", shotD.data.length)

for (const [label, id] of [
  ["T", "aJLpuUP0qi56eWdACt"],
  ["P", "Qonafp_oDi56eWdACt"],
]) {
  try {
    const s = await framer.screenshot(id, { format: "png", scale: 1 })
    fs.writeFileSync(`.tmp/arbour-nh-card-${label}.png`, s.data)
    console.log(label, s.data.length)
  } catch (e) {
    console.log(label, e.message)
  }
}

// Also list viewport for photo fills via serialize attrs
const pagePath = "/neighbourhoods"
const photoT = await framer.agent.serialize(
  { id: "aJLpuUP0qpk4EKsdIR", depth: 0 },
  { pagePath }
)
const photoP = await framer.agent.serialize(
  { id: "Qonafp_oDpk4EKsdIR", depth: 0 },
  { pagePath }
)
console.log(
  JSON.stringify({
    T: {
      fill: photoT.attributes?.fill,
      pos: photoT.attributes?.position,
      h: photoT.attributes?.height,
      w: photoT.attributes?.width,
    },
    P: {
      fill: photoP.attributes?.fill,
      pos: photoP.attributes?.position,
      h: photoP.attributes?.height,
      w: photoP.attributes?.width,
    },
  })
)

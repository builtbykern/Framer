const pagePath = "/"
const blurId = "lpuQSsTX0"
const desktopId = "WQLkyLRf1"

const blur = await framer.agent.serialize(
  {
    id: blurId,
    depth: 0,
    attributeFilter: [
      "name",
      "position",
      "left",
      "right",
      "top",
      "bottom",
      "width",
      "height",
      "zIndex",
      "$control__shape",
      "$control__position",
      "$control__blur",
      "$control__advanced",
    ],
  },
  { pagePath }
)

const desktop = await framer.agent.serialize(
  {
    id: desktopId,
    depth: 2,
    attributeFilter: ["name", "fill", "layout", "width", "height", "position", "top", "left", "right", "bottom", "zIndex"],
  },
  { pagePath }
)

console.log(JSON.stringify({ blur, desktop }, null, 2))

const review = await framer.agent.reviewChanges()
console.log("reviewKeys", Object.keys(review || {}))
console.log(
  "errors",
  JSON.stringify(review?.errors ?? review?.blockingErrors ?? null, null, 2)?.slice(0, 2000)
)

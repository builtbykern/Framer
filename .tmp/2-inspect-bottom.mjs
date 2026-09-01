const pagePath = "/"
const desktop = await framer.agent.serialize(
  {
    id: "WQLkyLRf1",
    depth: 3,
    attributeFilter: [
      "name",
      "fill",
      "layout",
      "width",
      "height",
      "position",
      "top",
      "left",
      "right",
      "bottom",
      "zIndex",
      "padding",
      "gap",
      "overflow",
      "radius",
      "borderBottom",
      "$control__shape",
      "$control__position",
      "$control__blur",
      "$control__advanced",
    ],
  },
  { pagePath }
)
console.log(JSON.stringify(desktop, null, 2).slice(0, 12000))

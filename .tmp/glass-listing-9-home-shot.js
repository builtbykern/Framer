const fs = require("fs")
const inst = await framer.agent.serialize(
    { id: "TymOeQqEs", depth: 0 },
    { pagePath: "/" }
)
console.log("motion", inst.attributes?.["$control__motion"])
const home = await framer.screenshot("WQLkyLRf1", { format: "png", scale: 1 })
fs.writeFileSync(
    "/Users/noel/Desktop/Framer/docs/projects/listings/Kern_GlassType_home.png",
    home.data
)
console.log("home", home.data.length)

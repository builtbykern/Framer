const info = await framer.getProjectInfo()
if (info.name !== "Fair Platform") throw new Error(info.name)

const lint = await framer.agent.applyChanges(
    'SET 41c8b9ae-e604-40b6-9d37-a14c3803c179 light="rgb(168, 168, 164)"; SET t5y0e5eot textColor="rgb(168, 168, 164)"; SET BEFvspdZd textColor="rgb(168, 168, 164)";',
    { pagePath: "/" }
)

const fs = require("fs")
const r = await framer.screenshot("tVu2ncruf", { format: "jpeg", scale: 1 })
fs.writeFileSync("/Users/noel/Desktop/Framer/.tmp/vitrine-shots/house-desktop.jpg", r.data)

console.log(JSON.stringify({ lint: lint.message, errors: lint.linter?.errors }, null, 2))

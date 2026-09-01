const fs = require("fs")
const path = "/Users/noel/Desktop/Framer/.tmp/halden-src/Drift_Plane.tsx"

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const files = await framer.getCodeFiles()
const drift = files.find((f) => f.id === "Og5966a")
if (!drift) throw new Error("missing Drift_Plane")

await drift.setFileContent(fs.readFileSync(path, "utf8"))
const driftTc = await drift.typecheck()
console.log(JSON.stringify({ project: info.name, driftTc }, null, 2))

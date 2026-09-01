const fs = require("fs")
const path = require("path")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

await framer.agent.applyChanges(
    'SET Yptm4PAEu $control__variant="Closed" $control__menuOpen="false";',
    { pagePath: "/" }
)

const outDir = "/Users/noel/Desktop/Framer/docs/projects/halden/media/stills"
fs.mkdirSync(outDir, { recursive: true })
const r = await framer.screenshot("WQLkyLRf1", { format: "png", scale: 2 })
const src = path.join(outDir, "d-home-plane@2x.png")
fs.writeFileSync(src, r.data)
console.log(
    JSON.stringify(
        {
            bytes: r.data.length,
            variant: (await framer.agent.getNode({ id: "Yptm4PAEu" }, { pagePath: "/" }))
                ?.attributes?.$control__variant,
        },
        null,
        2
    )
)

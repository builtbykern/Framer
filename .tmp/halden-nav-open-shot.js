const fs = require("fs")
const path = require("path")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const before = await framer.agent.getNode({ id: "Yptm4PAEu" }, { pagePath: "/" })
const openTry = await framer.agent.applyChanges(
    'SET Yptm4PAEu $control__variant="Open" $control__menuOpen="true";',
    { pagePath: "/" }
)
const after = await framer.agent.getNode({ id: "Yptm4PAEu" }, { pagePath: "/" })

const out = "/Users/noel/Desktop/Framer/docs/projects/halden/media/stills/d-nav-open.png"
const shot = await framer.screenshot("WQLkyLRf1", { format: "png", scale: 1 })
fs.writeFileSync(out, shot.data)

const close = await framer.agent.applyChanges(
    'SET Yptm4PAEu $control__variant="Closed" $control__menuOpen="false";',
    { pagePath: "/" }
)
const final = await framer.agent.getNode({ id: "Yptm4PAEu" }, { pagePath: "/" })

console.log(
    JSON.stringify(
        {
            before: {
                variant: before?.attributes?.$control__variant,
                menu: before?.attributes?.$control__menuOpen,
            },
            openTry: openTry.message,
            after: {
                variant: after?.attributes?.$control__variant,
                menu: after?.attributes?.$control__menuOpen,
            },
            bytes: shot.data.length,
            close: close.message,
            final: {
                variant: final?.attributes?.$control__variant,
                menu: final?.attributes?.$control__menuOpen,
            },
        },
        null,
        2
    )
)

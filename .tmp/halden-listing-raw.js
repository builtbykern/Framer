const fs = require("fs")
const path = require("path")

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const outDir = "/Users/noel/Desktop/Framer/docs/projects/halden/media/stills/raw"
fs.mkdirSync(outDir, { recursive: true })

async function shot(file, id, pagePath, clip) {
    const r = await framer.screenshot(id, {
        format: "png",
        scale: 2,
        clip,
    })
    fs.writeFileSync(path.join(outDir, file), r.data)
    return { file, bytes: r.data.length }
}

await framer.agent.applyChanges(
    'SET Yptm4PAEu $control__variant="Closed" $control__menuOpen="false"; SET nyI5jW7lAYptm4PAEu $control__variant="Closed" $control__menuOpen="false";',
    { pagePath: "/" }
)

const bytes = {}
const clips = [
    ["d-home.png", "WQLkyLRf1", "/", { x: 0, y: 0, width: 1440, height: 800 }],
    ["t-home.png", "BjqrvIntT", "/", { x: 0, y: 0, width: 768, height: 800 }],
    ["m-home.png", "nyI5jW7lA", "/", { x: 0, y: 0, width: 390, height: 800 }],
    ["d-lookbook.png", "rtJNTCNFr", "/work/:Work", { x: 0, y: 0, width: 1440, height: 1080 }],
    ["t-lookbook.png", "LSqc1L2WH", "/work/:Work", { x: 0, y: 0, width: 768, height: 1024 }],
    ["m-lookbook.png", "Tf2mbU7Bv", "/work/:Work", { x: 0, y: 0, width: 390, height: 844 }],
    ["d-404.png", "nACIEuvcP", "/404", { x: 0, y: 0, width: 1440, height: 800 }],
]
for (const [file, id, pagePath, clip] of clips) {
    Object.assign(bytes, { [file]: (await shot(file, id, pagePath, clip)).bytes })
}

await framer.agent.applyChanges(
    'SET Yptm4PAEu $control__variant="Open" $control__menuOpen="true";',
    { pagePath: "/" }
)
bytes["d-overlay.png"] = (await shot("d-overlay.png", "WQLkyLRf1", "/", { x: 0, y: 0, width: 1440, height: 800 })).bytes

await framer.agent.applyChanges(
    'SET Yptm4PAEu $control__variant="Closed" $control__menuOpen="false"; SET nyI5jW7lAYptm4PAEu $control__variant="Open" $control__menuOpen="true";',
    { pagePath: "/" }
)
bytes["m-overlay.png"] = (await shot("m-overlay.png", "nyI5jW7lA", "/", { x: 0, y: 0, width: 390, height: 800 })).bytes

await framer.agent.applyChanges(
    'SET Yptm4PAEu $control__variant="Closed" $control__menuOpen="false"; SET nyI5jW7lAYptm4PAEu $control__variant="Closed" $control__menuOpen="false";',
    { pagePath: "/" }
)

console.log(JSON.stringify({ bytes }, null, 2))

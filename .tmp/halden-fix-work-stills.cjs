const fs = require("fs")
const path = require("path")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const src = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Series_Stills.tsx",
    "utf8"
)
if (!src.includes('aspectRatio: isGrid ? undefined : "3 / 2"')) {
    throw new Error("missing still aspect-ratio fix")
}

const stills = await framer.getCodeFile("Series_Stills.tsx")
const file = await stills.setFileContent(src)
const typeErrors = await file.typecheck({ strict: true })

const cover = await framer.agent.applyChanges(
    `+FrameNode workHero parent="yn0nMGJJL" index="0" name="Cover" fill="var(--variable-KF94WDLfr)" overflow="clip" position="relative" width="100%" height="fit-image";`,
    { pagePath: "/work/:Work" }
)

const clearCover = await framer.agent.applyChanges(
    [
        `SET afUswAq7g $control__cover="";`,
        `SET LSqc1L2WHafUswAq7g $control__cover="";`,
        `SET Tf2mbU7BvafUswAq7g $control__cover="";`,
    ].join(" "),
    { pagePath: "/work/:Work" }
)

const dir = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(dir, { recursive: true })
const shots = {}
for (const [id, name] of [
    ["rtJNTCNFr", "sotd-work-desktop-after.jpg"],
    ["LSqc1L2WH", "sotd-work-tablet-after.jpg"],
    ["Tf2mbU7Bv", "sotd-work-phone-after.jpg"],
    ["WQLkyLRf1", "sotd-home-desktop-still.jpg"],
]) {
    const r = await framer.screenshot(id, { format: "jpeg", scale: 1 })
    fs.writeFileSync(path.join(dir, name), r.data)
    shots[name] = r.data.length
}

console.log(
    JSON.stringify(
        { typeErrors, cover, clearCover, shots },
        null,
        2
    ).slice(0, 8000)
)

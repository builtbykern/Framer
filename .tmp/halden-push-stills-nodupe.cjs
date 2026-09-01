const fs = require("fs")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const src = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Series_Stills.tsx",
    "utf8"
)
if (!src.includes("const stills = stackedStills")) {
    throw new Error("missing gallery-only stills")
}

const stillsFile = await framer.getCodeFile("Series_Stills.tsx")
const file = await stillsFile.setFileContent(src)
const typeErrors = await file.typecheck({ strict: true })

const dir = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
const shots = {}
for (const [id, name] of [
    ["rtJNTCNFr", "sotd-work-desktop-nodupe.jpg"],
    ["WQLkyLRf1", "sotd-home-desktop-final.jpg"],
    ["nyI5jW7lA", "sotd-home-phone-final.jpg"],
]) {
    const r = await framer.screenshot(id, { format: "jpeg", scale: 1 })
    fs.writeFileSync(`${dir}/${name}`, r.data)
    shots[name] = r.data.length
}

console.log(JSON.stringify({ typeErrors, shots }))

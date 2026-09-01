const fs = require("fs")
const dir = "/Users/noel/Desktop/Framer/.tmp/halden-src"

async function push(name, file) {
    const src = fs.readFileSync(`${dir}/${file}`, "utf8")
    const files = await framer.getCodeFiles()
    const f = files.find((x) => x.name === name)
    if (!f) throw new Error("missing " + name)
    const updated = await f.setFileContent(src)
    const typeErrors = await updated.typecheck({ strict: true })
    return { name, typeErrors }
}

const stills = await push("Series_Stills.tsx", "Series_Stills.live.tsx")
const page = await push("Page_Veil.tsx", "Page_Veil.live.tsx")
const still = await push("Still_Veil.tsx", "Still_Veil.live.tsx")

const canvas = await framer.agent.applyChanges(
    `SET v:IbckjcWn0:0:0 text="YEAR";
SET TRSPZ1XN3 opacity="1";
SET lgPBjlVA8 visible="false";`
)

console.log(JSON.stringify({ stills, page, still, canvas }, null, 2))

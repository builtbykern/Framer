const fs = require("fs")
const src = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Paper_Grain.tsx",
    "utf8"
)

const files = await framer.getCodeFiles()
const grain = files.find((f) => f.name === "Paper_Grain.tsx")
if (!grain) throw new Error("missing Paper_Grain")
const updated = await grain.setFileContent(src)
const typeErrors = await updated.typecheck({ strict: true })

const canvas = await framer.agent.applyChanges(
    `DEL DMaLBR4SR;
DEL OBacYlZQ_;
SET QZInDjV1k name="Closed";
SET lHV5aHgaZ name="Open";`
)

const work = (await framer.getCollections())[0]
const fields = await work.getFields()
const date = fields.find((f) => f.name === "Date")
let removedDate = null
if (date) removedDate = await work.removeFields([date.id])

console.log(
    JSON.stringify({ typeErrors, canvas, removedDate, dateId: date && date.id })
)

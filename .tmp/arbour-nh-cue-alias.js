const fs = require("fs")
const code = fs.readFileSync(
  "/Users/noel/Desktop/Framer/.tmp/Arbour_TerritoryHoverMedia.tsx",
  "utf8"
)
const files = await framer.getCodeFiles()
const file = files.find((f) => f.name === "Arbour_TerritoryHoverMedia.tsx")
if (!file) {
  console.log(JSON.stringify({ error: "no file", count: files.length, names: files.map((f) => f.name) }))
} else {
  await file.setFileContent(code)
  console.log(JSON.stringify({ ok: true, id: file.id, len: code.length, hasAlias: code.includes("props.cueBG") }))
}

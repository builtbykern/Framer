const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const guide = await framer.agent.readProject([
    { type: "implementation-guide-from-index", name: "CMS Collection Lists" },
])
const text = guide?.results?.[0]?.guide || ""
const fs = require("fs")
fs.writeFileSync("/Users/noel/Desktop/Framer/.tmp/cms-collection-lists-guide.md", text)
const hits = []
for (const needle of ["array", "nested", "Gallery", "variable-", "collectionList.collection"]) {
    const i = text.toLowerCase().indexOf(needle.toLowerCase())
    hits.push({ needle, i, slice: i >= 0 ? text.slice(Math.max(0, i - 80), i + 220) : null })
}
console.log(JSON.stringify({ project: info.name, bytes: text.length, hits }, null, 2))

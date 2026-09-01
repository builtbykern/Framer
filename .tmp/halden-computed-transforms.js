const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const guides = await framer.agent.readProject([
    { type: "implementation-guide-from-index", name: "Computed Values" },
])
const g = guides?.results?.[0]?.guide || ""
const names = [...g.matchAll(/"name":"([a-zA-Z0-9_]+)"/g)].map((m) => m[1])
const unique = [...new Set(names)].sort()
const headings = [...g.matchAll(/^#{1,3} .+$/gm)].map((m) => m[0])
const idx = g.search(/array|itemAt|atIndex|nthItem|getItem|elementAt|index/i)

console.log(
    JSON.stringify(
        {
            len: g.length,
            headings,
            uniqueTransforms: unique,
            idxSnippet: idx >= 0 ? g.slice(Math.max(0, idx - 180), idx + 900) : "no array match",
        },
        null,
        2
    )
)

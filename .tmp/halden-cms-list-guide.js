const r = await framer.agent.readProject([
    { type: "implementation-guide-from-index", name: "CMS Collection Lists" },
])
const text = JSON.stringify(r)
console.log(text.slice(0, 8000))

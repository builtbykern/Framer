const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const guides = await framer.agent.readProject([
    { type: "implementation-guide-from-index", name: "Computed Values" },
    { type: "implementation-guide-from-index", name: "CMS Detail Pages" },
    { type: "implementation-guide-from-index", name: "CMS Collection Lists" },
])

function extract(g) {
    const text = g?.guide || g?.content || JSON.stringify(g)
    const names = [...String(text).matchAll(/"name":\s*"([a-zA-Z0-9_]+)"/g)].map((m) => m[1])
    const headings = [...String(text).matchAll(/^#{1,3} .+$/gm)].map((m) => m[0])
    const isSetHits = [...String(text).matchAll(/isSet[\s\S]{0,400}/g)].slice(0, 3).map((m) => m[0])
    const imageHits = [...String(text).matchAll(/image[\s\S]{0,200}alt[\s\S]{0,200}/gi)].slice(0, 3).map((m) => m[0])
    return {
        name: g?.name,
        len: String(text).length,
        headings: headings.slice(0, 40),
        transforms: [...new Set(names)].sort(),
        isSetHits,
        imageHits,
    }
}

console.log(JSON.stringify((guides?.results || guides || []).map(extract), null, 2).slice(0, 25000))

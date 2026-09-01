const fs = require("fs")
const out = await framer.agent.readProject(
    [{ type: "implementation-guide-from-index", name: "CMS Collection Lists" }],
    { pagePath: "/" }
)
const guide = out.results?.[0]?.guide || JSON.stringify(out)
fs.writeFileSync("/Users/noel/Desktop/Framer/.tmp/cms-list-guide.md", guide)
const imgs = []
for (const q of [
    "glass house forest interior photography",
    "unmade linen bed morning light",
    "foggy night architecture chairs",
    "portrait man window sunlight room",
    "concrete staircase doorway light",
    "indoor pool steam tiled",
]) {
    const r = await framer.agent.queryImages({
        source: "unsplash",
        query: q,
        count: 2,
        orientation: "landscape",
        width: 1600,
    })
    imgs.push(...(r.results || []))
}
fs.writeFileSync(
    "/Users/noel/Desktop/Framer/.tmp/col-images.json",
    JSON.stringify(
        imgs.map((i) => ({ url: i.url, alt: i.alt })),
        null,
        2
    )
)
console.log(JSON.stringify({ guideBytes: guide.length, images: imgs.length }))

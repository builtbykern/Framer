const thumbPage = await framer.agent.serialize(
    { id: "Cw5hkff6a", depth: 2 },
    { pagePath: "/thumbnail" }
)
function walk(n, acc) {
    if (!n) return acc
    acc.push({
        id: n.id,
        name: n.name,
        type: n.type,
        w: n.attributes?.width,
        h: n.attributes?.height,
    })
    for (const c of n.children || []) walk(c, acc)
    return acc
}
console.log(
    "thumb",
    JSON.stringify(
        {
            id: thumbPage.id,
            name: thumbPage.name,
            w: thumbPage.attributes?.width,
            h: thumbPage.attributes?.height,
            layers: walk(thumbPage, []),
        },
        null,
        2
    ).slice(0, 4000)
)

const fs = require("fs")
const home = await framer.screenshot("WQLkyLRf1", { format: "png", scale: 1 })
fs.writeFileSync(
    "/Users/noel/Desktop/Framer/docs/projects/listings/Kern_GlassType_home.png",
    home.data
)
console.log("home shot", home.data.length)

try {
    const t = await framer.screenshot("Cw5hkff6a", { format: "png", scale: 1 })
    fs.writeFileSync(
        "/Users/noel/Desktop/Framer/docs/projects/listings/Kern_GlassType_thumb_page.png",
        t.data
    )
    console.log("thumb shot", t.data.length)
} catch (e) {
    console.log("thumb shot fail", String(e).slice(0, 300))
}

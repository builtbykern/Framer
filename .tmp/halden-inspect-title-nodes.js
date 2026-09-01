const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const title = await framer.getNode("GAokM9PPJ")
const type = await framer.getNode("FddpNYFNF")
const year = await framer.getNode("XwtyrQVdF")
const meta = await framer.getNode("YonVwWSco")
const workTitle = await framer.getNode("gPAtEpWYL")
const workBody = await framer.getNode("YYTXabA2d")

function slim(n) {
    if (!n) return null
    const a = n.attributes || n
    return {
        id: n.id,
        name: n.name,
        type: n.__class || n.type,
        keys: Object.keys(a || {}).sort(),
        text: a.text,
        html: typeof a.html === "string" ? a.html.slice(0, 400) : a.html,
        visible: a.visible,
        opacity: a.opacity,
        width: a.width,
        height: a.height,
        overflow: a.overflow,
        fontSize: a.fontSize,
        locks: a.locks,
    }
}

console.log(
    JSON.stringify(
        {
            collection: {
                title: slim(title),
                type: slim(type),
                year: slim(year),
                meta: slim(meta),
            },
            work: {
                title: slim(workTitle),
                body: slim(workBody),
            },
        },
        null,
        2
    )
)

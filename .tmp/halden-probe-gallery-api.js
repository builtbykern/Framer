const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const keys = []
for (const k of Object.getOwnPropertyNames(framer).concat(Object.keys(framer))) {
    if (!keys.includes(k)) keys.push(k)
}
const proto = Object.getPrototypeOf(framer)
const protoKeys = proto ? Object.getOwnPropertyNames(proto) : []

const computed = await framer.agent.readProject([
    { type: "implementation-guide-from-index", name: "Computed Values" },
])
const computedText = JSON.stringify(computed)
const galleryHits = []
for (const re of [/galler/gi, /arrayToArray/g, /arrayItem/g, /getItem/g, /index/g]) {
    const m = computedText.match(re)
    if (m) galleryHits.push({ re: String(re), n: m.length })
}

console.log(
    JSON.stringify(
        {
            framerOwn: keys.sort(),
            protoKeys: protoKeys.sort(),
            computedLen: computedText.length,
            galleryHits,
            computedHead: computedText.slice(0, 6000),
        },
        null,
        2
    )
)

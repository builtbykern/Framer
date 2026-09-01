const info = await framer.getProjectInfo()
if (info.name !== "Fair Platform") throw new Error(info.name)

const ids = [
    "yZes1fNVs",
    "KVgGkkS4z",
    "ViBjWFaCI",
    "aqpa10Il4",
    "orXs4NZw2",
    "QhfNwiny9",
    "yAd2lMDSW",
    "tVu2ncruf",
    "J1kd1wjJe",
    "pWw0UM2JG",
]
const nodes = await framer.agent.serializeNodes({
    ids,
    depth: 3,
    attributeFilter: [
        "id",
        "name",
        "text",
        "padding",
        "gap",
        "stackDistribution",
        "stackDirection",
        "overflow",
        "hideScrollbars",
        "textStylePreset",
        "fontSize",
        "letterSpacing",
        "textTransform",
        "width",
        "height",
        "layoutTemplate",
    ],
})

function collect(n, acc = []) {
    const list = Array.isArray(n) ? n : [n]
    for (const x of list) {
        if (!x) continue
        if (x.innerText || x.text || x.attributes) {
            acc.push({
                id: x.id,
                name: x.name,
                type: x.type,
                attrs: x.attributes,
                innerText: x.innerText,
            })
        }
        if (x.children) collect(x.children, acc)
    }
    return acc
}

console.log(JSON.stringify({ nodes: collect(nodes) }, null, 2))

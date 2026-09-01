const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const pagePath = "/work/:Work"
const types = [
    "FrameNode",
    "ComponentInstanceNode",
    "RichTextNode",
    "ComponentNode",
    "GalleryNode",
    "ImageNode",
    "CollectionListNode",
]
const found = {}
for (const t of types) {
    try {
        const nodes = await framer.agent.getNodesOfTypes({ types: [t] }, { pagePath })
        found[t] = (nodes || []).slice(0, 8).map((n) => ({
            id: n.id,
            name: n.name,
            type: n.type,
        }))
        found[`${t}Count`] = (nodes || []).length
    } catch (e) {
        found[t] = String(e).slice(0, 200)
    }
}

const cover = await framer.agent.getNode({ id: "lgPBjlVA8" }, { pagePath })

const proto = Object.getPrototypeOf(framer)
const protoNames = proto ? Object.getOwnPropertyNames(proto) : []
const own = Object.getOwnPropertyNames(framer)
const listed = []
for (const k in framer) listed.push(k)

console.log(
    JSON.stringify(
        {
            found,
            coverKeys: Object.keys(cover?.attributes || {}),
            coverFill: cover?.attributes?.fill,
            protoNames: protoNames.filter((k) => /creat|node|collect|galler|bind|clone|add/i.test(k)),
            ownFilter: own.filter((k) => /creat|node|collect|galler|bind|clone|add/i.test(k)),
            listedFilter: listed.filter((k) => /creat|node|collect|galler|bind|clone|add/i.test(k)),
            listedCount: listed.length,
            ownCount: own.length,
        },
        null,
        2
    )
)

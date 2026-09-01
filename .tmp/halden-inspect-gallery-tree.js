const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const agentKeys = Object.keys(framer.agent || {}).sort()
const framerKeys = Object.keys(framer).filter((k) => typeof framer[k] === "function").sort()

const galleryField = await framer.agent.getNode(
    { id: "MI_ZHE7kH" },
    { pagePath: "/work/:Work" }
)
const stills = await framer.agent.serializeNodes(
    { ids: ["MI_ZHE7kH"], depth: 6 },
    { pagePath: "/work/:Work" }
)

const cover = await framer.agent.getNode(
    { id: "lgPBjlVA8" },
    { pagePath: "/work/:Work" }
)

console.log(
    JSON.stringify(
        {
            agentKeys,
            framerKeys,
            galleryFieldAttrs: Object.keys(galleryField?.attributes || {}),
            galleryFieldName: galleryField?.name,
            coverFill: cover?.attributes?.fill,
            stillsTree: stills,
        },
        null,
        2
    ).slice(0, 20000)
)

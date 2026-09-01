const fs = require("fs")
const path = require("path")
const dir = "/Users/noel/Desktop/Framer/.tmp/halden-shots"

async function download(url, file) {
    const res = await fetch(url)
    const buf = Buffer.from(await res.arrayBuffer())
    fs.writeFileSync(file, buf)
    return buf.length
}

const urls = {
    "audit-vekter-phone.jpg":
        "https://framerusercontent.com/screenshots/on-demand/47d33160-787f-42c2-ab42-8675faa06d86.jpg",
    "audit-vekter-tablet.jpg":
        "https://framerusercontent.com/screenshots/on-demand/42ba15ef-8a83-475e-a418-850581749a9e.jpg",
    "audit-vekter-desktop.jpg":
        "https://framerusercontent.com/screenshots/on-demand/b2ae394b-b8bb-4ca1-9e27-b50eb93e4783.jpg",
}

const downloaded = {}
for (const [name, url] of Object.entries(urls)) {
    downloaded[name] = await download(url, path.join(dir, name))
}

const work = await framer.agent.serializeNodes(
    {
        ids: ["H9TnltXVB", "gSGwySyKV", "cMyCjMOpL"],
        depth: 6,
    },
    { pagePath: "/" }
)

const lists = await framer.agent.getNodesOfTypes(
    { types: ["CollectionListNode", "CollectionItemNode"] },
    { pagePath: "/" }
)

console.log(
    JSON.stringify(
        {
            downloaded,
            listCount: lists?.length,
            lists: (lists || []).map((n) => ({
                id: n.id,
                name: n.name,
                type: n.type,
                parent: n.parentId,
            })),
            work,
        },
        null,
        2
    )
)

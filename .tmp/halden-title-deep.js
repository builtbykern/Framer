const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const titleDeep = await framer.agent.serializeNodes(
    { ids: ["GAokM9PPJ", "YonVwWSco", "FddpNYFNF"], depth: 8 },
    { pagePath: "/" }
)

const workPage = await framer.agent.serializeNodes(
    { ids: ["rtJNTCNFr"], depth: 4 },
    { pagePath: "/work/:Work" }
)

function walk(nodes, acc = []) {
    for (const n of nodes || []) {
        const a = n.attributes || {}
        const isText =
            n.type === "RichTextNode" ||
            n.type === "TextNode" ||
            /Title|Body|Description|Type|Year|Credit/i.test(n.name || "")
        if (isText) {
            acc.push({
                id: n.id,
                name: n.name,
                type: n.type,
                text: a.text,
                visible: a.visible,
            })
        }
        if (n.children) walk(n.children, acc)
    }
    return acc
}

console.log(
    JSON.stringify(
        {
            titleDeep,
            workTexts: walk(workPage),
        },
        null,
        2
    )
)

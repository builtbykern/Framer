function walk(node, depth, acc) {
    if (!node || depth > 6) return
    const a = node.attributes || {}
    const name = node.name || a.name
    const interesting =
        /still|cover|gallery|look|journal|image|figure|caption|veil/i.test(
            String(name || "")
        ) ||
        a.collectionList ||
        String(node.component || "").includes("codeFile") ||
        (typeof a.fill === "string" && a.fill.includes("variable"))
    if (interesting || depth <= 2) {
        acc.push({
            depth,
            id: node.id,
            type: node.type,
            name,
            component: node.component || node.$componentDisplayName,
            fill:
                typeof a.fill === "string"
                    ? a.fill.slice(0, 80)
                    : a.fill
                      ? typeof a.fill
                      : undefined,
            width: a.width,
            height: a.height,
            visible: a.visible,
            controls: Object.fromEntries(
                Object.entries(a).filter(([k]) => k.startsWith("$control"))
            ),
            collectionList: a.collectionList,
        })
    }
    for (const c of node.children || []) walk(c, depth + 1, acc)
}

const tree = await framer.agent.serializeNodes({
    ids: ["rtJNTCNFr"],
    depth: 6,
})
const acc = []
walk(tree[0], 0, acc)

const fs = require("fs")
const path = require("path")
const dir = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
const shot = await framer.screenshot("rtJNTCNFr", { format: "jpeg", scale: 1 })
fs.writeFileSync(path.join(dir, "sotd-work-desktop.jpg"), shot.data)

console.log(
    JSON.stringify(
        { shotBytes: shot.data.length, nodes: acc },
        null,
        2
    ).slice(0, 16000)
)

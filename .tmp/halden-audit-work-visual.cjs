const fs = require("fs")
const path = require("path")

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const [page] = await framer.agent.serializeNodes({
    ids: ["fpoP3kuA4"],
    depth: 6,
})
if (!page) throw new Error("Work CMS page not found")

const breakpoints = (page.children || []).filter(
    (node) => node.type === "FrameNode"
)
const outputDir = "/Users/noel/Desktop/Framer/.tmp/halden-work-audit"
fs.mkdirSync(outputDir, { recursive: true })

const shots = {}
for (const node of breakpoints) {
    const safeName = String(node.name || node.id)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
    const result = await framer.screenshot(node.id, {
        format: "jpeg",
        scale: 1,
    })
    const outputPath = path.join(outputDir, `${safeName}.jpg`)
    fs.writeFileSync(outputPath, result.data)
    shots[node.id] = {
        name: node.name,
        path: outputPath,
        bytes: result.data.length,
    }
}

const nodes = []
const walk = (node, depth = 0) => {
    const attrs = node.attributes || {}
    if (
        depth <= 2 ||
        /nav|title|meta|gallery|cover|still|body|description|footer/i.test(
            String(node.name || "")
        ) ||
        String(node.component || "").includes("codeFile")
    ) {
        nodes.push({
            depth,
            id: node.id,
            type: node.type,
            name: node.name,
            component: node.component || node.$componentDisplayName,
            rect: node.$rect,
            attributes: Object.fromEntries(
                Object.entries(attrs).filter(([key]) =>
                    [
                        "width",
                        "height",
                        "gap",
                        "padding",
                        "font",
                        "fontSize",
                        "lineHeight",
                        "fill",
                        "layout",
                        "position",
                    ].some((token) => key.includes(token))
                )
            ),
        })
    }
    for (const child of node.children || []) walk(child, depth + 1)
}
walk(page)

console.log(
    JSON.stringify(
        {
            page: { id: page.id, name: page.name },
            breakpoints: breakpoints.map((node) => ({
                id: node.id,
                name: node.name,
                rect: node.$rect,
                attributes: node.attributes,
            })),
            shots,
            nodes,
        },
        null,
        2
    )
)

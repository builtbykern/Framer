const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const fs = require("fs")
const path = require("path")
const outDir = "/Users/noel/Desktop/Framer/.tmp/halden-mkt-shots"
fs.mkdirSync(outDir, { recursive: true })

const work = (await framer.getCollections()).find((c) => c.name === "Work")
const items = await work.getItems()
const featured = items.map((i) => ({
    slug: i.slug,
    featured: i.fieldData?.LrPrf7_RQ?.value ?? i.fieldData?.LrPrf7_RQ,
}))

const codeFiles = (await framer.getCodeFiles()).map((f) => ({
    name: f.name || f.path,
    id: f.id,
}))

const formNodes = await framer.agent.getNodesOfTypes(
    { types: ["FormPlainTextInputNode", "FormBooleanInputNode", "FormSelectNode"] },
    { pagePath: "/" }
)
const forms = (formNodes?.nodes || formNodes || []).map((n) => ({
    id: n.id,
    name: n.name,
    type: n.type,
    placeholder: n.attributes?.formInputPlaceholder,
    required: n.attributes?.formInputRequired,
    hidden: n.attributes?.formInputHidden,
    label: n.attributes?.formInputName,
}))

const errorStill = await framer.agent.getNode({ id: "zbRdfLfnM" }, { pagePath: "/404" })
const errorParent = errorStill?.$parentId
    ? await framer.agent.getNode({ id: errorStill.$parentId }, { pagePath: "/404" })
    : null

let root
try {
    const roots = await framer.agent.getNodesOfTypes({ types: ["RootNode"] })
    root = (roots?.nodes || roots || [])[0]
} catch (e) {
    root = { error: String(e.message || e) }
}

const shots = [
    { id: "WQLkyLRf1", file: "home-desktop.png", pagePath: "/" },
    { id: "rtJNTCNFr", file: "work-desktop.png", pagePath: "/work/:Work" },
]
const page404 = await framer.agent.serialize(
    { id: "nizhx6wAX", depth: 2, attributeFilter: ["name"] },
    { pagePath: "/404" }
)
const homeBreaks = await framer.agent.serialize(
    { id: "augiA20Il", depth: 1, attributeFilter: ["name"] },
    { pagePath: "/" }
)

const bytes = {}
for (const s of shots) {
    const r = await framer.screenshot(s.id, { format: "png", scale: 1 })
    fs.writeFileSync(path.join(outDir, s.file), r.data)
    bytes[s.file] = r.data.length
}

const phoneHome = await framer.agent.getNodesOfTypes({ types: ["FrameNode"] }, { pagePath: "/" })
const phones = (phoneHome?.nodes || phoneHome || [])
    .filter((n) => n.name === "Phone" || n.name === "Tablet" || n.name === "Desktop")
    .map((n) => ({ id: n.id, name: n.name }))

console.log(
    JSON.stringify(
        {
            featured,
            allFeatured: featured.every((f) => f.featured === true),
            codeFiles,
            forms,
            errorStill: {
                name: errorStill?.name,
                component: errorStill?.component,
                parent: errorParent?.name,
                visible: errorStill?.attributes?.visible,
            },
            rootMeta: root?.attributes,
            homeBreaks: (homeBreaks?.children || []).map((c) => ({ id: c.id, name: c.name })),
            page404Kids: (page404?.children || []).map((c) => ({ id: c.id, name: c.name })),
            phones,
            bytes,
        },
        null,
        2
    )
)

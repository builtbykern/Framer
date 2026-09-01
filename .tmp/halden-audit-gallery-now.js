const fs = require("fs")
const path = require("path")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error("project " + info.name)

const pagePath = "/work/:Work"
const outDir = "/Users/noel/Desktop/Framer/.tmp/halden-audit"
fs.mkdirSync(outDir, { recursive: true })

function brief(n) {
    const a = n.attributes || {}
    return {
        id: n.id,
        name: n.name,
        type: n.type,
        visible: a.visible,
        fill: typeof a.fill === "string" ? a.fill.slice(0, 80) : a.fill,
        width: a.width,
        height: a.height,
        gap: a.gap,
        collectionList: a.collectionList,
        still1: a.$control__still1,
        still2: a.$control__still2,
        still3: a.$control__still3,
        still4: a.$control__still4,
        images: a.$control__images ? "bound" : null,
        cover: a.$control__cover,
        max: a.$control__max,
        component: n.component,
        kids: (n.children || []).length,
    }
}

function walk(n, acc = []) {
    acc.push(brief(n))
    for (const c of n.children || []) walk(c, acc)
    return acc
}

const gallery = await framer.agent.serializeNodes(
    { ids: ["yn0nMGJJL", "lktcbNgBF", "afUswAq7g", "lgPBjlVA8", "tpxRKRIQw"] },
    { pagePath }
)

const instances = await framer.agent.getNodesOfTypes(
    { types: ["ComponentInstanceNode"] },
    { pagePath }
)
const stills = (instances || []).filter(
    (n) => n.name === "Series Stills" || String(n.component || "").includes("jeA2cvO")
)

const homeStills = await framer.agent.getNode(
    { id: "yGFlVus2I" },
    { pagePath: "/" }
)

const lookbookComp = await framer.agent.getNode({ id: "V8E8Dw0jT" })
const probe = await framer.agent.getNode({ id: "lVzjHmnDx" }, { pagePath })

const work = (await framer.getCollections()).find((c) => c.name === "Work")
const items = await work.getItems()
const fields = await work.getFields()

const live = await framer.getCodeFile("Series_Stills.tsx")
const liveContent = String(live.content || "")

const shots = []
for (const [id, name] of [
    ["lgPBjlVA8", "audit-cover.png"],
    ["afUswAq7g", "audit-stills.png"],
    ["yn0nMGJJL", "audit-gallery.png"],
    ["lktcbNgBF", "audit-list.png"],
    ["rtJNTCNFr", "audit-work-desktop.png"],
    ["Tf2mbU7Bvyn0nMGJJL", "audit-gallery-phone.png"],
]) {
    try {
        const r = await framer.screenshot(id, { format: "png", scale: 1 })
        fs.writeFileSync(path.join(outDir, name), r.data)
        shots.push({ id, name, bytes: r.data.length })
    } catch (e) {
        shots.push({ id, name, error: String(e).slice(0, 240) })
    }
}

console.log(
    JSON.stringify(
        {
            project: info.name,
            galleryTree: gallery.map((n) => walk(n)),
            stillsOnWork: stills.map((n) => ({
                id: n.id,
                name: n.name,
                component: n.component,
            })),
            homeStills: {
                id: homeStills?.id,
                still1: homeStills?.attributes?.$control__still1,
                images: homeStills?.attributes?.$control__images,
                max: homeStills?.attributes?.$control__max,
                cover: homeStills?.attributes?.$control__cover,
            },
            leftovers: {
                lookbook: lookbookComp ? { id: lookbookComp.id, name: lookbookComp.name } : null,
                probe: probe ? { id: probe.id, name: probe.name } : null,
            },
            fields: fields.map((f) => ({ id: f.id, name: f.name, type: f.type })),
            items: items.map((it) => ({
                slug: it.slug,
                title: it.fieldData?.lmTMqy_0B?.value || it.fieldData?.lmTMqy_0B,
                cover: (it.fieldData?.KF94WDLfr?.value?.url || "").slice(-40),
                gal: (it.fieldData?.WTTAaEd5y?.value || []).length,
                s1: (it.fieldData?.YDvzMtarJ?.value?.url || "").slice(-40),
                s1alt: it.fieldData?.YDvzMtarJ?.value?.altText,
            })),
            live: {
                hasSlots: liveContent.includes("still1:"),
                hasCanvasStills: liveContent.includes("CANVAS_STILLS"),
                prefersSlotsOnCanvas: liveContent.includes(
                    "onCanvas && slotStills.length > 0"
                ),
            },
            shots,
        },
        null,
        2
    )
)

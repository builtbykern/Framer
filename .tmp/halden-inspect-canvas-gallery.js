const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

function brief(n, depth = 0) {
    if (!n || depth > 5) return null
    const a = n.attributes || {}
    const keys = {}
    for (const [k, v] of Object.entries(a)) {
        if (
            /gap|visible|overflow|layout|width|height|collection|control|fill|image/i.test(
                k
            )
        ) {
            keys[k] = v
        }
    }
    return {
        id: n.id,
        name: n.name,
        type: n.type,
        ...keys,
        kids: (n.children || []).map((c) => brief(c, depth + 1)),
    }
}

const gallery = await framer.agent.serializeNodes(
    { ids: ["yn0nMGJJL", "afUswAq7g", "lktcbNgBF"], depth: 5 },
    { pagePath: "/work/:Work" }
)

const collections = await framer.getCollections()
const work = (collections || []).find((c) => c.name === "Work")
let stills = null
if (work) {
    const items = await work.getItems()
    const salt = (items || []).find(
        (it) => it.slug === "salt-light" || String(it.slug).includes("salt")
    )
    const galleryField = salt?.fieldData?.WTTAaEd5y || salt?.fieldData
    stills = {
        slug: salt?.slug,
        keys: salt && typeof salt.fieldData === "object" ? Object.keys(salt.fieldData) : [],
        galleryType: galleryField && typeof galleryField,
        gallery:
            galleryField && typeof galleryField === "object"
                ? JSON.stringify(galleryField).slice(0, 2500)
                : galleryField,
    }
}

const fs = require("fs")
const path = require("path")
const outDir = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(outDir, { recursive: true })
const shots = []
for (const [id, name] of [
    ["yn0nMGJJL", "canvas-gallery-now.png"],
    ["afUswAq7g", "canvas-stills-now.png"],
    ["rtJNTCNFr", "canvas-work-desktop-now.png"],
]) {
    try {
        const r = await framer.screenshot(id, { format: "png", scale: 1 })
        fs.writeFileSync(path.join(outDir, name), r.data)
        shots.push({ id, name, bytes: r.data.length })
    } catch (e) {
        shots.push({ id, name, error: String(e) })
    }
}

console.log(
    JSON.stringify(
        {
            project: info.name,
            gallery: gallery.map((n) => brief(n)),
            stills,
            shots,
        },
        null,
        2
    )
)

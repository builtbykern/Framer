const fs = require("fs")
const path = require("path")
const dir = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(dir, { recursive: true })

const listShot = await framer.screenshot("H9TnltXVB", { format: "png", scale: 1 })
fs.writeFileSync(path.join(dir, "cms-work-list.png"), listShot.data)

const vekter = await framer.agent.readProject(
    [{ type: "screenshot", id: "H9TnltXVB" }],
    { pagePath: "/" }
)

let cms = null
try {
    const collections = await framer.getCollections?.()
    cms = collections
} catch (e) {
    cms = { getCollections: String(e) }
}

let items = null
try {
    items = await framer.getCollectionItems?.("Work")
} catch (e) {
    try {
        const col = await framer.getCollection("Work")
        items = { keys: col && Object.keys(col), sample: col }
    } catch (e2) {
        items = { err: String(e), err2: String(e2) }
    }
}

console.log(
    JSON.stringify(
        {
            listShotBytes: listShot.data.length,
            vekter,
            cmsType: typeof cms,
            itemsType: typeof items,
            itemsPreview: Array.isArray(items)
                ? items.slice(0, 3).map((i) => ({
                      id: i.id,
                      slug: i.slug,
                      featured: i.featured,
                  }))
                : items,
        },
        null,
        2
    )
)

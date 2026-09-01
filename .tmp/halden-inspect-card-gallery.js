const card = await framer.agent.getNode({ id: "gSGwySyKV" }, { pagePath: "/" })

function walk(node, depth = 0) {
    if (!node || depth > 4) return null
    const a = node.attributes || {}
    return {
        id: node.id,
        name: node.name,
        type: node.type,
        fill: a.fill,
        visible: a.visible,
        width: a.width,
        height: a.height,
        images: a.$control__images,
        cover: a.$control__cover,
        children: (node.children || []).map((c) => walk(c, depth + 1)),
    }
}

const collections = await framer.getCollections()
const work = collections.find((c) => c.name === "Work")
const items = await work.getItems()
const salt = items.find((it) => it.slug === "salt-light")
const gallery = salt.fieldData.WTTAaEd5y
const gal0 = gallery?.value?.[0] ?? gallery?.[0]

console.log(
    JSON.stringify(
        {
            card: walk(card),
            galleryType: gallery?.type,
            galleryKeys: gallery && typeof gallery === "object" ? Object.keys(gallery) : [],
            gal0:
                gal0 && typeof gal0 === "object"
                    ? {
                          keys: Object.keys(gal0),
                          type: gal0.type,
                          valueKeys:
                              gal0.value && typeof gal0.value === "object"
                                  ? Object.keys(gal0.value)
                                  : typeof gal0.value,
                          url: gal0.url || gal0.src || gal0.value?.url,
                          nested: gal0.value,
                      }
                    : gal0,
        },
        null,
        2
    )
)

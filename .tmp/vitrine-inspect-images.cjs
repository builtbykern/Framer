const itemIds = [
    "lkZBIAg86",
    "DishTwo?",
]

const tree = await framer.agent.serializeNodes({
    ids: [
        "yAd2lMDSW",
        "t62LHpSTayAd2lMDSW",
        "u75vHQkARyAd2lMDSW",
        "O2btPltNw",
        "OdvHkNWXz",
        "omF0gODuR",
        "QYwZhiOCq",
        "aDU_xPLrv",
        "t2sbY17Aq",
        "t62LHpSTa",
        "u75vHQkAR",
    ],
    depth: 4,
    attributeFilter: [
        "name",
        "fill",
        "overflow",
        "hideScrollbars",
        "stackDirection",
        "collectionList",
        "width",
        "height",
        "layout",
        "$control__variant",
        "$control__cover",
        "$control__still",
        "$control__title",
        "appearEffect",
        "imageRendering",
    ],
})

const coll = await framer.getCollection("t2sbY17Aq").catch((e) => String(e))
let items = null
try {
    items = await framer.getCollectionItems("t2sbY17Aq")
} catch (e) {
    items = String(e)
}

let managed = null
try {
    managed = await framer.getManagedCollection("t2sbY17Aq")
} catch (e) {
    managed = String(e)
}

console.log(
    JSON.stringify(
        {
            coll,
            managedType: typeof managed,
            itemCount: Array.isArray(items) ? items.length : items,
            itemKeys: Array.isArray(items)
                ? items.slice(0, 2).map((it) => Object.keys(it))
                : null,
            items: Array.isArray(items)
                ? items.map((it) => ({
                      id: it.id,
                      slug: it.slug,
                      title: it.fieldData?.title || it.title,
                      cover: it.fieldData?.cover || it.cover,
                      still: it.fieldData?.still || it.still,
                      featured: it.fieldData?.featured || it.featured,
                      module: it.fieldData?.module || it.module,
                  }))
                : items,
            nodes: tree.map((n) => ({
                id: n.id,
                name: n.name,
                type: n.type,
                attrs: n.attributes,
                vars: n.variables?.map((v) => ({
                    id: v.id,
                    name: v.name,
                    type: v.type,
                    initialValue: v.initialValue,
                })),
                kids: n.children?.map((c) => ({
                    id: c.id,
                    name: c.name,
                    type: c.type,
                    fill: c.attributes?.fill,
                    cl: c.attributes?.collectionList,
                    variant: c.attributes?.$control__variant,
                    cover: c.attributes?.$control__cover,
                    still: c.attributes?.$control__still,
                    title: c.attributes?.$control__title,
                    dir: c.attributes?.stackDirection,
                    overflow: c.attributes?.overflow,
                    w: c.attributes?.width,
                    h: c.attributes?.height,
                    kids: c.children?.map((g) => ({
                        id: g.id,
                        name: g.name,
                        type: g.type,
                        fill: g.attributes?.fill,
                        variant: g.attributes?.$control__variant,
                        cover: g.attributes?.$control__cover,
                        still: g.attributes?.$control__still,
                    })),
                })),
            })),
        },
        null,
        2
    )
)

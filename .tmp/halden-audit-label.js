const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const pagePath = "/work/:Work"
const capIds = ["luKFLN0T4", "SN5v6c7F8", "vbn33y5kF", "gzGSFMFmp"]
const replicas = [
    { bp: "desktop", prefix: "" },
    { bp: "tablet", prefix: "LSqc1L2WH" },
    { bp: "phone", prefix: "Tf2mbU7Bv" },
]

const captions = []
for (const r of replicas) {
    for (const id of capIds) {
        const nid = r.prefix + id
        const n = await framer.agent.getNode({ id: nid }, { pagePath })
        captions.push({
            bp: r.bp,
            id: nid,
            found: Boolean(n),
            name: n?.name,
            preset: n?.attributes?.textStylePreset,
            fontName: n?.attributes?.fontName,
            fontSize: n?.attributes?.fontSize,
            textColor: n?.attributes?.textColor,
            text: n?.attributes?.text,
        })
    }
}

const work = (await framer.getCollections()).find((c) => c.name === "Work")
const fields = await work.getFields()
const typeField = fields.find((f) => f.id === "ZMWV4jFbG" || f.name === "Type")
const items = await work.getItems()
const types = items.map((i) => {
    const raw = i.fieldData?.[typeField.id]
    return {
        slug: i.slug,
        title: i.fieldData?.lmTMqy_0B?.value || i.fieldData?.lmTMqy_0B,
        type: raw?.value ?? raw ?? null,
        typeName: typeField?.name,
    }
})

function walk(n, acc = []) {
    if (!n) return acc
    if (n.type === "RichTextNode" || n.class === "RichTextNode") {
        acc.push({
            id: n.id,
            name: n.name,
            preset: n.attributes?.textStylePreset,
            fontName: n.attributes?.fontName,
            textColor: n.attributes?.textColor,
            text: typeof n.attributes?.text === "string"
                ? n.attributes.text.slice(0, 80)
                : n.attributes?.text?.from || JSON.stringify(n.attributes?.text)?.slice(0, 80),
        })
    }
    for (const c of n.children || []) walk(c, acc)
    return acc
}

const infoRail = await framer.agent.serializeNodes(
    { ids: ["rT9WGdFVR", "yn0nMGJJL"], depth: 8 },
    { pagePath }
)
const texts = infoRail.flatMap((n) => walk(n))

const typeCases = typeField
    ? {
          id: typeField.id,
          name: typeField.name,
          type: typeField.type,
          cases: typeField.cases || typeField.options || typeField.values,
          raw: Object.keys(typeField),
      }
    : null

console.log(
    JSON.stringify(
        {
            captions,
            captionsNotLabel: captions.filter((c) => c.found && c.preset !== "Label"),
            captionsMissing: captions.filter((c) => !c.found),
            typeField: typeCases,
            itemTypes: types,
            itemsMissingType: types.filter((t) => t.type == null || t.type === ""),
            railAndGallery: texts,
            notLabel: texts.filter((t) => t.preset !== "Label"),
        },
        null,
        2
    )
)

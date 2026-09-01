const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const pagePath = "/work/:Work"
const work = (await framer.getCollections()).find((c) => c.name === "Work")
const fields = await work.getFields()
const items = await work.getItems()

const ctx = await framer.agent.getContext({ pagePath })
const ctxStr = typeof ctx === "string" ? ctx : JSON.stringify(ctx)
const styleSection = ctxStr.match(/<text-styles>[\s\S]*?<\/text-styles>|<available-text-styles>[\s\S]*?<\/available-text-styles>|TextStylePreset[\s\S]{0,4000}/)
const colorSection = ctxStr.match(/<color-styles>[\s\S]*?<\/color-styles>|ColorStyleToken[\s\S]{0,2000}/)

function walk(n, acc = []) {
    if (!n) return acc
    const comp = n.component || n.attributes?.component
    if (String(comp || "").includes("jeA2cvO") || n.name === "Series Stills") {
        acc.push({ id: n.id, name: n.name, parent: n.$parentId, page: n.pagePath })
    }
    for (const c of n.children || []) walk(c, acc)
    return acc
}

const homeFull = await framer.agent.serialize({ id: "augiA20Il", depth: 12, attributeFilter: ["name", "component"] }, { pagePath: "/" })
const pasteboard = await framer.agent.getNodesOfTypes({ types: ["ComponentInstanceNode"] }, { pagePath: "/" })
const workComps = await framer.agent.getNodesOfTypes({ types: ["ComponentInstanceNode"] }, { pagePath })

const coverTablet = await framer.agent.getNode({ id: "LSqc1L2WHlgPBjlVA8" }, { pagePath })
const coverPhone = await framer.agent.getNode({ id: "Tf2mbU7BvlgPBjlVA8" }, { pagePath })
const galTablet = await framer.agent.getNode({ id: "LSqc1L2WHyn0nMGJJL" }, { pagePath })
const galPhone = await framer.agent.getNode({ id: "Tf2mbU7BvyN0nMGJJL" }, { pagePath })
const galPhone2 = await framer.agent.getNode({ id: "Tf2mbU7BvyN0nMGJJL".replace("yN", "yn") }, { pagePath })

const tagProbe = await framer.agent.serializeNodes(
    { ids: ["rT9WGdFVR"], depth: 4, attributeFilter: ["name", "visible", "text", "textStylePreset", "textColor"] },
    { pagePath }
)

console.log(
    JSON.stringify(
        {
            fields: fields.map((f) => ({ id: f.id, name: f.name, type: f.type })),
            itemStills: items.map((i) => ({
                slug: i.slug,
                still1: Boolean(i.fieldData?.YDvzMtarJ || i.fieldData?.["YDvzMtarJ"]),
                still2: Boolean(i.fieldData?.e_xsxTDiE),
                still3: Boolean(i.fieldData?.sFlCMgFPv),
                still4: Boolean(i.fieldData?.YgsGo3UQv),
                galleryLen: Array.isArray(i.fieldData?.WTTAaEd5y) ? i.fieldData.WTTAaEd5y.length : null,
                still1Preview: JSON.stringify(i.fieldData?.YDvzMtarJ)?.slice(0, 180),
                gal0alt: Array.isArray(i.fieldData?.WTTAaEd5y) ? i.fieldData.WTTAaEd5y[0]?.alt || i.fieldData.WTTAaEd5y[0] : null,
            })),
            styleSection: styleSection?.[0]?.slice(0, 4000),
            colorSection: colorSection?.[0]?.slice(0, 1500),
            homeSeries: walk(homeFull),
            homeCompCount: pasteboard?.length || pasteboard?.nodes?.length,
            homeJe: (pasteboard?.nodes || pasteboard || []).filter((n) =>
                String(n.component || n.attributes?.component || "").includes("jeA2cvO")
            ).map((n) => ({ id: n.id, name: n.name })),
            workJe: (workComps?.nodes || workComps || []).filter((n) =>
                String(n.component || n.attributes?.component || "").includes("jeA2cvO")
            ).map((n) => ({ id: n.id, name: n.name })),
            coverTablet: coverTablet && { id: coverTablet.id, fill: coverTablet.attributes?.fill, width: coverTablet.attributes?.width },
            coverPhone: coverPhone && { id: coverPhone.id, fill: coverPhone.attributes?.fill, width: coverPhone.attributes?.width },
            galTablet: galTablet && { id: galTablet.id, width: galTablet.attributes?.width, gap: galTablet.attributes?.gap },
            galPhone: (galPhone || galPhone2) && {
                id: (galPhone || galPhone2).id,
                width: (galPhone || galPhone2).attributes?.width,
                gap: (galPhone || galPhone2).attributes?.gap,
            },
            tagProbe: JSON.stringify(tagProbe).slice(0, 4000),
        },
        null,
        2
    )
)

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const pagePath = "/work/:Work"

const phoneStill1 = await framer.agent.getNode({ id: "Tf2mbU7BvbOI4aJofa" }, { pagePath })
const phoneFig1 = await framer.agent.getNode({ id: "Tf2mbU7BvoZ3ZTH2de" }, { pagePath })
const tabletStill1 = await framer.agent.getNode({ id: "LSqc1L2WHbOI4aJofa" }, { pagePath })
const phoneStill3 = await framer.agent.getNode({ id: "Tf2mbU7BvYWDE8tH3l" }, { pagePath })
const phoneFig3 = await framer.agent.getNode({ id: "Tf2mbU7BvuK70pBYt6" }, { pagePath })

const work = (await framer.getCollections()).find((c) => c.name === "Work")
const items = await work.getItems()
const alts = items.map((i) => {
    const pick = (id) => {
        const raw = i.fieldData?.[id]
        const v = raw?.value || raw
        return {
            alt: v?.alt || v?.altText || null,
            url: String(v?.url || "").slice(-40),
        }
    }
    const gal = i.fieldData?.WTTAaEd5y
    const rows = Array.isArray(gal?.value) ? gal.value : Array.isArray(gal) ? gal : []
    const galAlts = rows.map((row) => {
        const img = row?.fieldData?.ZkP9UsFFL?.value || row?.fieldData?.ZkP9UsFFL
        return img?.alt || img?.altText || null
    })
    return {
        slug: i.slug,
        stills: [
            pick("YDvzMtarJ"),
            pick("e_xsxTDiE"),
            pick("sFlCMgFPv"),
            pick("YgsGo3UQv"),
        ],
        galAlts,
        galLen: rows.length,
    }
})

console.log(
    JSON.stringify(
        {
            collectionId: work.id,
            phoneStill1: phoneStill1?.attributes,
            phoneFig1: phoneFig1 && {
                width: phoneFig1.attributes?.width,
                stackAlignment: phoneFig1.attributes?.stackAlignment,
            },
            tabletStill1: tabletStill1 && {
                stackDistribution: tabletStill1.attributes?.stackDistribution,
                width: tabletStill1.attributes?.width,
            },
            phoneStill3: phoneStill3 && {
                stackDistribution: phoneStill3.attributes?.stackDistribution,
            },
            phoneFig3: phoneFig3 && { width: phoneFig3.attributes?.width },
            alts,
        },
        null,
        2
    )
)

const cms = await framer.agent.serializeNodes({
    ids: ["t2sbY17Aq"],
    depth: 1,
})

const card = await framer.agent.serializeNodes({
    ids: ["OdvHkNWXz"],
    depth: 1,
    attributeFilter: ["name"],
})

const house = await framer.screenshot("tVu2ncruf", { format: "jpeg", scale: 1 })
const desk = await framer.screenshot("J1kd1wjJe", { format: "jpeg", scale: 1 })
const four = await framer.screenshot("pWw0UM2JG", { format: "jpeg", scale: 1 })
const fs = require("fs")
const dir = "/Users/noel/Desktop/Framer/.tmp/vitrine-shots"
fs.writeFileSync(dir + "/house-desktop.jpg", house.data)
fs.writeFileSync(dir + "/desk-desktop.jpg", desk.data)
fs.writeFileSync(dir + "/404-desktop.jpg", four.data)

console.log(
    JSON.stringify(
        {
            variants: card[0]?.children?.map((c) => ({ id: c.id, name: c.name, type: c.type })),
            items: (cms[0]?.children || []).map((it) => ({
                id: it.id,
                title: it.attributes?.title,
                slug: it.attributes?.slug,
                featured: it.attributes?.featured,
                module: it.attributes?.module,
                cover: it.attributes?.cover?.src || it.attributes?.cover,
                still: it.attributes?.still?.src || it.attributes?.still,
                coverAlt: it.attributes?.cover?.alt,
                stillAlt: it.attributes?.still?.alt,
            })),
        },
        null,
        2
    )
)

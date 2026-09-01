const info = await framer.getProjectInfo()
if (info.name !== "Fair Platform") throw new Error(info.name)

const add = await framer.agent.applyChanges(
    [
        '+FrameNode i5CphXhmV parent="yAd2lMDSW" name="Empty State" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="start" gap="8px" padding="8px 0px 8px 0px" position="relative" width="auto" height="auto" minWidth="240px" visible.from="var(--variable-yAd2lMDSW-item-count)" visible.transforms.0.name="equals" visible.transforms.0.value="0";',
        '+RichTextNode empCopy01 parent="i5CphXhmV" name="Empty" text="No sheets on the wall." textStylePreset="Body" width="auto" height="auto";',
        'SET t62LHpSTa overflow="visible" height="auto";',
        'SET u75vHQkAR overflow="visible" height="auto";',
    ].join(" "),
    { pagePath: "/" }
)

const tree = await framer.agent.serializeNodes({
    ids: ["yAd2lMDSW", "i5CphXhmV", "t62LHpSTa", "u75vHQkAR"],
    depth: 2,
    attributeFilter: ["name", "visible", "overflow", "height", "collectionList"],
})

const fs = require("fs")
const dir = "/Users/noel/Desktop/Framer/.tmp/vitrine-shots"
for (const [id, name] of [
    ["WQLkyLRf1", "home-desktop.jpg"],
    ["t62LHpSTa", "home-tablet.jpg"],
    ["u75vHQkAR", "home-phone.jpg"],
]) {
    const r = await framer.screenshot(id, { format: "jpeg", scale: 1 })
    fs.writeFileSync(`${dir}/${name}`, r.data)
}

console.log(
    JSON.stringify(
        {
            add: { message: add.message, errors: add.linter?.errors, renamed: add.renamedIds },
            empty: tree.find((n) => n.id === "i5CphXhmV" || n.name === "Empty State"),
            listKids: tree.find((n) => n.id === "yAd2lMDSW")?.children?.map((c) => ({
                id: c.id,
                name: c.name,
                visible: c.attributes?.visible,
            })),
            tablet: tree.find((n) => n.id === "t62LHpSTa")?.attributes,
            phone: tree.find((n) => n.id === "u75vHQkAR")?.attributes,
        },
        null,
        2
    )
)

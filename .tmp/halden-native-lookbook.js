const fs = require("fs")
const path = require("path")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const pagePath = "/work/:Work"
const muted = "var(--token-8028b435-146d-4074-967e-823e6635036f)"

const stills = [
    {
        row: "stillRow1",
        fig: "stillFig1",
        img: "stillImg1",
        cap: "stillCap1",
        field: "YDvzMtarJ",
        label: "01",
        name: "Still 1",
        width: "90%",
        distribution: "end",
        align: "end",
        textAlign: "right",
    },
    {
        row: "stillRow2",
        fig: "stillFig2",
        img: "stillImg2",
        cap: "stillCap2",
        field: "e_xsxTDiE",
        label: "02",
        name: "Still 2",
        width: "100%",
        distribution: "start",
        align: "start",
        textAlign: "left",
    },
    {
        row: "stillRow3",
        fig: "stillFig3",
        img: "stillImg3",
        cap: "stillCap3",
        field: "sFlCMgFPv",
        label: "03",
        name: "Still 3",
        width: "88%",
        distribution: "start",
        align: "start",
        textAlign: "left",
    },
    {
        row: "stillRow4",
        fig: "stillFig4",
        img: "stillImg4",
        cap: "stillCap4",
        field: "YgsGo3UQv",
        label: "04",
        name: "Still 4",
        width: "94%",
        distribution: "end",
        align: "end",
        textAlign: "right",
    },
]

const createDsl = stills
    .map(
        (s, i) => `
+FrameNode ${s.row} parent="yn0nMGJJL" index="${i + 1}" name="${s.name}" layout="stack" stackDirection="horizontal" stackDistribution="${s.distribution}" stackAlignment="start" width="100%" height="auto" gap="0px";
SET ${s.row} visible.from="var(--variable-${s.field})" visible.transforms.0.name="isSet";
+FrameNode ${s.fig} parent="${s.row}" name="Figure" layout="stack" stackDirection="vertical" stackAlignment="${s.align}" gap="8px" width="${s.width}" height="auto" htmlTag="figure";
+FrameNode ${s.img} parent="${s.fig}" name="Image" fill="var(--variable-${s.field})" height="fit-image" width="100%" overflow="clip" layout="null";
+RichTextNode ${s.cap} parent="${s.fig}" name="Caption" text="${s.label}" textStylePreset="Label" textColor="${muted}" textAlignment="${s.textAlign}" width="100%" height="auto";
`
    )
    .join("\n")

const created = await framer.agent.applyChanges(createDsl, { pagePath })
if (created?.errors && Object.keys(created.errors).length) {
    throw new Error(`create stills: ${JSON.stringify(created.errors)}`)
}

const renamed = created?.renamedIds || {}
const img1Id = renamed.stillImg1 || "stillImg1"
const rowIds = stills.map((s) => renamed[s.row] || s.row)

const nativeImg = await framer.agent.getNode({ id: img1Id }, { pagePath })
if (nativeImg?.attributes?.fill !== "var(--variable-YDvzMtarJ)") {
    throw new Error(`still 1 fill ${nativeImg?.attributes?.fill}`)
}

const removed = await framer.agent.applyChanges(
    `DEL MZykSQ6C5; DEL svCIoIp1F; DEL MI_ZHE7kH;`,
    { pagePath }
)

const gallery = await framer.agent.serializeNodes(
    { ids: ["yn0nMGJJL"], depth: 4, attributeFilter: ["name", "fill", "visible", "gap", "width", "height", "component"] },
    { pagePath }
)

const outDir = "/Users/noel/Desktop/Framer/.tmp/halden-audit"
fs.mkdirSync(outDir, { recursive: true })
const galShot = await framer.screenshot("yn0nMGJJL", { format: "png", scale: 1 })
fs.writeFileSync(path.join(outDir, "audit-native-lookbook.png"), galShot.data)
const deskShot = await framer.screenshot("rtJNTCNFr", { format: "png", scale: 1 })
fs.writeFileSync(path.join(outDir, "audit-work-desktop-native.png"), deskShot.data)
const phoneGal = await framer.screenshot("Tf2mbU7Bvyn0nMGJJL", { format: "png", scale: 1 })
fs.writeFileSync(path.join(outDir, "audit-native-lookbook-phone.png"), phoneGal.data)

const children = (gallery?.[0]?.children || gallery?.children || []).map((c) => ({
    id: c.id,
    name: c.name,
    fill: c.attributes?.fill,
    visible: c.attributes?.visible,
    kids: (c.children || []).map((k) => ({
        id: k.id,
        name: k.name,
        fill: k.attributes?.fill,
        kids: (k.children || []).map((g) => ({
            id: g.id,
            name: g.name,
            fill: g.attributes?.fill,
        })),
    })),
}))

console.log(
    JSON.stringify(
        {
            createdMessage: created?.message,
            renamed,
            removedMessage: removed?.message,
            removedErrors: removed?.errors,
            still1Fill: nativeImg?.attributes?.fill,
            still1Height: nativeImg?.attributes?.height,
            galleryChildren: children,
            bytes: {
                gallery: galShot.data.length,
                desktop: deskShot.data.length,
                phone: phoneGal.data.length,
            },
        },
        null,
        2
    )
)

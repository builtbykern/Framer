const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const files = await framer.getCodeFiles()
const slim = (files || []).map((f) => {
    const c = typeof f.content === "string" ? f.content : ""
    return {
        id: f.id,
        name: f.name,
        bytes: c.length,
        hasPadIndex: c.includes("function padIndex"),
        callsPadIndex: c.includes("padIndex("),
        hasUnwrap: c.includes("function unwrapControlValue"),
        hasNudge: c.includes("collectionNudgeDone"),
        hasColumnWidth: c.includes("columnWidth"),
        hasStillGutter: c.includes("stillGutter"),
    }
})
console.log(JSON.stringify({ project: info.name, count: slim.length, files: slim }, null, 2))

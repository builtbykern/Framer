const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)
const files = await framer.getCodeFiles()
const drift = files.find((f) => f.id === "Og5966a")
const content = typeof drift?.content === "string" ? drift.content : ""
const driftTc = await drift.typecheck()
console.log(
    JSON.stringify(
        {
            project: info.name,
            stillGap: content.includes("stillGap"),
            unwrap: content.includes("unwrapControlValue"),
            stillGutterOnly: content.includes(
                "coerceNumber(\n            collectionCtrl?.stillGutter,"
            ),
            driftTc,
        },
        null,
        2
    )
)

const fs = require("fs")
const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const files = await framer.getCodeFiles()
if (!files?.length) throw new Error("no code files")

const src = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Drift_Plane.tsx",
    "utf8"
)
if (!src.includes('COLLECTION_VEIL_BLUR = "blur(4px)"')) {
    throw new Error("enter veil was retuned — abort")
}
if (!src.includes('containerType: "inline-size"')) {
    throw new Error("missing container context")
}
if (!src.includes("100cqw")) throw new Error("missing cqw widths")
if (src.includes("cullOrphanStills")) throw new Error("cull still present")
if (src.includes("collectionModuleWidths")) throw new Error("js widths present")
if (src.includes("sizeCollectionCover")) throw new Error("js cover present")

const drift = await framer.getCodeFile("Drift_Plane.tsx")
const file = await drift.setFileContent(src)
const typeErrors = await file.typecheck({ strict: true })
console.log(JSON.stringify({ id: file.id, typeErrors }))

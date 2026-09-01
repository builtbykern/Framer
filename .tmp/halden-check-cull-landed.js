const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const files = await framer.getCodeFiles()
const drift = files.find((f) => f.name === "Drift_Plane.tsx")
const c = String(drift?.content || "")
console.log(
    JSON.stringify({
        n: files.length,
        printScale: c.includes("PRINT_SCALE"),
        stillAspect: c.includes("STILL_ASPECT"),
        heightAutoStills: c.includes("height: auto !important;\n    min-height: 0 !important;\n    min-width: 0 !important;"),
        syncCull: c.includes("cullOrphanStills(root, host, collectionStillGutter)"),
        overflowHidden: c.includes('overflowY: "hidden"'),
    })
)

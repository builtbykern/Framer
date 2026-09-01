const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const files = await framer.getCodeFiles()
const drift = files.find((f) => f.name === "Drift_Plane.tsx")
const stills = files.find((f) => f.name === "Series_Stills.tsx")
const driftCode = await drift.getFileContent()
const stillsCode = await stills.getFileContent()
console.log(
    JSON.stringify({
        project: info.name,
        driftLen: driftCode.length,
        stillsLen: stillsCode.length,
        fillDriftCover: driftCode.includes("function fillDriftCover"),
        freezeOverflow: driftCode.includes('overflowX: freezeAll ? "visible"'),
        cover320: driftCode.includes("min-height: 320px"),
        stacked: stillsCode.includes("const stacked = inCollection || freeze"),
    })
)

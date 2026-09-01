const info = await framer.getProjectInfo()
const names = []
for (const key in framer) names.push(key)
await new Promise((resolve) => setTimeout(resolve, 4000))
const files = await framer.getCodeFiles()
const drift = await framer.getCodeFile("Drift_Plane.tsx")
const stills = await framer.getCodeFile("Series_Stills.tsx")
console.log(
    JSON.stringify(
        {
            project: info.name,
            framerKeys: names.sort(),
            fileCount: files.length,
            fileNames: files.map((f) => f.name),
            drift: drift && { id: drift.id, name: drift.name, path: drift.path },
            stills: stills && { id: stills.id, name: stills.name, path: stills.path },
        },
        null,
        2
    )
)

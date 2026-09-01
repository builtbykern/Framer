const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)
const file = await framer.getCodeFile("Drift_Plane.tsx")
const c = String(file.content || "")
console.log(
    JSON.stringify(
        {
            project: info.name,
            id: file.id,
            bytes: c.length,
            hasDescCss: c.includes('[data-framer-name="Description"]'),
            typeRow: (c.match(/\[data-framer-name="Type"\] \{[\s\S]*?grid-row: \d/) || [])[0],
            stillRow: (c.match(/\[data-framer-name="Still Grid"\] \{[\s\S]*?grid-row: \d/) || [])[0],
            span: (c.match(/grid-row: 1 \/ span \d/) || [])[0],
        },
        null,
        2
    )
)

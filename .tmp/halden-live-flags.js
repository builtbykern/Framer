const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)
const files = await framer.getCodeFiles()
const stills = files.find((f) => f.name === "Series_Stills.tsx")
const drift = files.find((f) => f.name === "Drift_Plane.tsx")
const node = await framer.agent.serializeNodes(
    { ids: ["yGFlVus2I"], depth: 0 },
    { pagePath: "/" }
)
console.log(
    JSON.stringify(
        {
            project: info.name,
            count: files.length,
            stills: stills && {
                id: stills.id,
                bytes: String(stills.content || "").length,
                paint: String(stills.content || "").includes("isCssPaintSrc"),
                padIndex: String(stills.content || "").includes("function padIndex"),
            },
            drift: drift && {
                id: drift.id,
                bytes: String(drift.content || "").length,
                noWidth: !String(drift.content || "").includes("columnWidth"),
                typeRow4: String(drift.content || "").includes(
                    '[data-framer-name="Type"] {\n    grid-row: 4'
                ),
            },
            stillKeys: Object.keys(node?.[0]?.attributes || {}).filter((k) =>
                k.startsWith("$control")
            ),
            stillAttrs: node?.[0]?.attributes,
        },
        null,
        2
    )
)

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const pagePath = "/work/:Work"
const muted = "var(--token-8028b435-146d-4074-967e-823e6635036f)"
const ids = [
    "SN5v6c7F8",
    "vbn33y5kF",
    "gzGSFMFmp",
    "LSqc1L2WHSN5v6c7F8",
    "LSqc1L2WHvbn33y5kF",
    "LSqc1L2WHgzGSFMFmp",
    "Tf2mbU7BvSN5v6c7F8",
    "Tf2mbU7Bvvbn33y5kF",
    "Tf2mbU7BvgzGSFMFmp",
]

const dsl = ids
    .map((id) => `SET ${id} textStylePreset="Label" textColor="${muted}";`)
    .join(" ")

const applied = await framer.agent.applyChanges(dsl, { pagePath })
if (applied?.errors && Object.keys(applied.errors).length) {
    throw new Error(JSON.stringify(applied.errors))
}

const stillInter = []
const capIds = ["luKFLN0T4", "SN5v6c7F8", "vbn33y5kF", "gzGSFMFmp"]
const prefixes = ["", "LSqc1L2WH", "Tf2mbU7Bv"]
const report = []
for (const prefix of prefixes) {
    for (const id of capIds) {
        const n = await framer.agent.getNode({ id: prefix + id }, { pagePath })
        const row = {
            id: prefix + id,
            preset: n?.attributes?.textStylePreset,
            fontName: n?.attributes?.fontName,
            fontSize: n?.attributes?.fontSize,
            textColor: n?.attributes?.textColor,
        }
        report.push(row)
        if (row.preset !== "Label" || row.fontName === "Inter") stillInter.push(row)
    }
}

console.log(
    JSON.stringify(
        {
            applied: applied.message,
            report,
            stillInter,
        },
        null,
        2
    )
)

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const pages = ["/", "/404", "/work/:Work"]
const instances = []
for (const pagePath of pages) {
    const result = await framer.agent.getNodesOfTypes(
        { types: ["ComponentInstanceNode"] },
        { pagePath }
    )
    const nodes = result?.nodes || result || []
    for (const n of nodes) {
        const cid = String(n.componentId || n.attributes?.componentId || n.url || "")
        const name = String(n.name || "")
        if (
            cid.includes("jeA2cvO") ||
            cid.includes("Series_Stills") ||
            name === "Series Stills"
        ) {
            instances.push({ pagePath, id: n.id, name, cid })
        }
    }
}

const filesBefore = (await framer.getCodeFiles()).map((f) => ({
    id: f.id,
    name: f.name,
}))

const stills = await framer.getCodeFile("Series_Stills.tsx")
if (instances.length && stills) {
    await framer.removeNodes(instances.map((i) => i.id))
}

let removed = false
if (stills && typeof stills.remove === "function") {
    await stills.remove()
    removed = true
} else if (stills) {
    await framer.removeCodeFile(stills.id)
    removed = true
}

const veil = await framer.getCodeFile("Page_Veil.tsx")
if (!veil) throw new Error("missing Page_Veil")
const veilNext = veil.content.replace(
    `    if (/\\/work\\/:(?:slug|Work)\\b/i.test(pathname)) return true
    if (pathname === "/info" || pathname === "/contact") return true
    return false`,
    `    if (/\\/work\\/:(?:slug|Work)\\b/i.test(pathname)) return true
    return false`
)
if (veilNext === veil.content) throw new Error("Page_Veil placeholder paths not found")
await veil.setFileContent(veilNext)
const veilTc = await (await framer.getCodeFile("Page_Veil.tsx")).typecheck()

const drift = await framer.getCodeFile("Drift_Plane.tsx")
if (!drift) throw new Error("missing Drift_Plane")
const driftNext = drift.content.replace(
    `                [data-driftplane-cms] [data-framer-name="Still Grid"],
                [data-driftplane-cms] [aria-label="Series stills"] {
                    display: none !important;
                }`,
    `                [data-driftplane-cms] [data-framer-name="Still Grid"] {
                    display: none !important;
                }`
)
if (driftNext === drift.content) throw new Error("Drift_Plane Series stills CSS not found")
await drift.setFileContent(driftNext)
const driftTc = await (await framer.getCodeFile("Drift_Plane.tsx")).typecheck()

const filesAfter = (await framer.getCodeFiles()).map((f) => ({
    id: f.id,
    name: f.name,
}))
const veilLive = await framer.getCodeFile("Page_Veil.tsx")
const driftLive = await framer.getCodeFile("Drift_Plane.tsx")

console.log(
    JSON.stringify(
        {
            instances,
            filesBefore,
            removed,
            filesAfter,
            veilHasInfo: veilLive.content.includes('"/info"'),
            veilHasContact: veilLive.content.includes('"/contact"'),
            veilHasWorkPlaceholder: veilLive.content.includes("/work/:"),
            driftHasSeriesAria: driftLive.content.includes('aria-label="Series stills"'),
            veilTc,
            driftTc,
        },
        null,
        2
    )
)

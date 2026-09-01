const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const veil = await framer.getCodeFile("Page_Veil.tsx")
const drift = await framer.getCodeFile("Drift_Plane.tsx")
const start = veil.content.indexOf("function isPlaceholderPath")
const fn = veil.content.slice(start, veil.content.indexOf("function internalHref"))
const stills = await framer.getCodeFile("Series_Stills.tsx")
const files = (await framer.getCodeFiles()).map((f) => f.name)

console.log(
    JSON.stringify(
        {
            files,
            stillsGone: stills == null,
            placeholderFn: fn,
            driftHasStillGridHide: drift.content.includes('[data-framer-name="Still Grid"]'),
            driftHasSeriesAria: drift.content.includes("Series stills"),
        },
        null,
        2
    )
)

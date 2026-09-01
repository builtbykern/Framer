const files = await framer.getCodeFiles()
const series = files.find((f) => f.id === "jeA2cvO")
const drift = files.find((f) => f.id === "Og5966a")
const seriesCode = await series.content
const driftCode = await drift.content
const info = await framer.getProjectInfo()
console.log(
    JSON.stringify(
        {
            project: info.name,
            series: {
                hasAnimateHost: seriesCode.includes("animate={") && seriesCode.includes("hostFrozen"),
                hasWrappedImage: seriesCode.includes('wrapped.type === "image"'),
            },
            drift: {
                hideOnlyZero: seriesCode.includes('[data-collection-in="0"]') === false &&
                    driftCode.includes('[data-collection-in="0"]'),
                alwaysIn: driftCode.includes('node.dataset.collectionIn = "1"'),
                neverZeroIo: !driftCode.includes('entry.isIntersecting ? "1" : "0"'),
                hideAllImgs: driftCode.includes('[aria-label="Series stills"] img {\n    opacity: 0;'),
            },
        },
        null,
        2
    )
)

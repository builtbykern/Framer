const files = await framer.getCodeFiles()
const drift = files.find((f) => f.id === "Og5966a")
const code = await drift.content
console.log(
    JSON.stringify(
        {
            bytes: code.length,
            forceCss: code.includes("COLLECTION_STILL_FORCE_CSS"),
            onlyZeroHide: code.includes('[data-collection-in="0"] [aria-label="Series stills"] img'),
            ioOnlyOne: code.includes('if (entry.isIntersecting) el.dataset.collectionIn = "1"'),
        },
        null,
        2
    )
)

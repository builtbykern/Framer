const fonts = await framer.agent.readProject(
    [
        { type: "font-search", name: "Syne" },
        { type: "font-search", name: "IBM Plex Mono" },
        { type: "font-search", name: "Inter" },
        { type: "implementation-guide-from-index", name: "CMS Collection Lists" },
    ],
    { pagePath: "/" }
)
const home = await framer.agent.serializeNodes(
    { ids: ["augiA20Il"], depth: 4 },
    { pagePath: "/" }
)
let images = null
try {
    images = await framer.agent.queryImages({
        source: "unsplash",
        query: "cinematic interior architecture glass house",
        count: 3,
        orientation: "landscape",
        width: 1600,
    })
} catch (e) {
    images = { error: String(e) }
}
console.log(
    JSON.stringify(
        {
            fontResults: (fonts.results || []).map((r) => ({
                type: r.type,
                name: r.name,
                error: r.error,
                keys: Object.keys(r),
                snippet: JSON.stringify(r).slice(0, 600),
            })),
            home,
            imagesType: typeof images,
            imagesKeys: images && typeof images === "object" ? Object.keys(images) : null,
            imagesPreview: JSON.stringify(images).slice(0, 1200),
        },
        null,
        2
    )
)

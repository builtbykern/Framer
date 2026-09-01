function urls(pack) {
    return (pack?.results || []).map((b) => ({ url: b.url, alt: b.alt || "" }))
}

const metal = await framer.agent.queryImages({
    source: "unsplash",
    query: "handmade brass jewelry on linen",
    count: 4,
    orientation: "landscape",
    width: 1600,
})
const clay = await framer.agent.queryImages({
    source: "unsplash",
    query: "ceramic bowl on wooden bench",
    count: 4,
    orientation: "squarish",
    width: 1400,
})
const tool = await framer.agent.queryImages({
    source: "unsplash",
    query: "goldsmith bench tools close up",
    count: 4,
    orientation: "portrait",
    width: 1200,
})
const cloth = await framer.agent.queryImages({
    source: "unsplash",
    query: "folded linen textile workshop",
    count: 4,
    orientation: "landscape",
    width: 1600,
})

const M = urls(metal)
const C = urls(clay)
const T = urls(tool)
const L = urls(cloth)

require("fs").writeFileSync(
    "/Users/noel/Desktop/Framer/.tmp/vitrine-images.json",
    JSON.stringify({ metal: M, clay: C, tool: T, cloth: L }, null, 2)
)

const pick = (arr, i) => arr[i] || arr[0] || { url: "", alt: "workshop piece" }

const pieces = [
    {
        id: "lkZBIAg86",
        title: "Gauge Ring",
        date: "2025-06-23",
        dek: "A thick band, unpolished inside. Forged once, left to mark.",
        module: "Landscape",
        cover: pick(M, 0),
        still: pick(T, 0),
    },
    {
        id: "tZytgw_pu",
        title: "Dish Two",
        date: "2025-03-14",
        dek: "A small clay dish. The foot is still wet in the photo.",
        module: "Square",
        cover: pick(C, 0),
        still: pick(C, 1),
    },
    {
        id: "N8rSuGdDW",
        title: "Pin Spare",
        date: "2025-02-11",
        dek: "Brass pin, cluster of offcuts on the bench.",
        module: "Cluster",
        cover: pick(T, 1),
        still: pick(M, 1),
    },
    {
        id: "vWwUi2iXi",
        title: "Linen Band",
        date: "2025-01-08",
        dek: "A length of linen for wrapping finished work.",
        module: "Landscape",
        cover: pick(L, 0),
        still: pick(L, 1),
    },
    {
        id: "EDUlD2m19",
        title: "Cup Lip",
        date: "2024-11-02",
        dek: "Thrown cup, lip cut after the last pull.",
        module: "Cluster",
        cover: pick(C, 2),
        still: pick(T, 2),
    },
    {
        id: "RXZYU_SGB",
        title: "Wire Study",
        date: "2024-10-16",
        dek: "Portrait of a single wire form before soldering.",
        module: "Portrait",
        cover: pick(T, 3),
        still: pick(M, 2),
    },
    {
        id: "X3kJRxUxX",
        title: "Square Tray",
        date: "2024-08-19",
        dek: "A square tray in pale clay. No glaze yet.",
        module: "Square",
        cover: pick(C, 3),
        still: pick(L, 2),
    },
    {
        id: "zyvPp0qI0",
        title: "Bench Hook",
        date: "2023-12-04",
        dek: "A hook made to hold work. Not for sale.",
        module: "Portrait",
        cover: pick(M, 3),
        still: pick(T, 0),
    },
]

const cmds = [
    'SET t2sbY17Aq name="Piece";',
    'SET yAd2lMDSW name="Piece List" collectionList.collection="Piece" overflow="auto" hideScrollbars="true";',
    'SET FZFYEKdG1 name="Piece" path="/piece/:Piece";',
    'SET O2btPltNw name="Piece Item" link.href="/piece/:Piece" link.collectionItem="var(--variable-N_XD2ACYK)";',
]
for (const e of pieces) {
    const coverUrl = e.cover.url
    const stillUrl = e.still.url
    if (!coverUrl || !stillUrl) continue
    cmds.push(
        `SET ${e.id} $control__title="${e.title}" $control__date="${e.date}" $control__description="${e.dek}" $control__featured="true" $control__module="${e.module}" $control__cover.src="${coverUrl}" $control__cover.alt="${String(e.cover.alt).replace(/"/g, "")}" $control__still.src="${stillUrl}" $control__still.alt="${String(e.still.alt).replace(/"/g, "")}";`
    )
}

const r = await framer.agent.applyChanges(cmds.join(" "), { pagePath: "/" })
console.log(
    JSON.stringify(
        {
            counts: {
                metal: M.length,
                clay: C.length,
                tool: T.length,
                cloth: L.length,
            },
            cms: r,
        },
        null,
        2
    )
)

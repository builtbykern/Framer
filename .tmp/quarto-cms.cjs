const imgs = JSON.parse(
    require("fs").readFileSync(
        "/Users/noel/Desktop/Framer/.tmp/quarto-images.json",
        "utf8"
    )
)
const B = imgs.books
const P = imgs.press
const R = imgs.paper
const S = imgs.spines

const editions = [
    {
        id: "lkZBIAg86",
        title: "Mill Ledger",
        date: "2025-06-23",
        dek: "Accounts from a mill that printed its own wages. Cloth boards, sewn.",
        module: "Landscape",
        cover: P[0],
        still: B[0],
    },
    {
        id: "tZytgw_pu",
        title: "Hours Bound",
        date: "2025-03-14",
        dek: "A daybook in eight gatherings. The type is the weather.",
        module: "Square",
        cover: B[2],
        still: B[1],
    },
    {
        id: "N8rSuGdDW",
        title: "Kiln Notes",
        date: "2025-02-11",
        dek: "A pamphlet of firing logs. Soft cover, untrimmed.",
        module: "Cluster",
        cover: P[3],
        still: R[3],
    },
    {
        id: "vWwUi2iXi",
        title: "Salt Binding",
        date: "2025-01-08",
        dek: "An atlas of coast roads. Landscape sheets, case bound.",
        module: "Landscape",
        cover: B[3],
        still: R[0],
    },
    {
        id: "EDUlD2m19",
        title: "Night Atlas",
        date: "2024-11-02",
        dek: "Star charts for a room with no windows. Cluster of plates.",
        module: "Cluster",
        cover: S[0],
        still: B[0],
    },
    {
        id: "RXZYU_SGB",
        title: "Pin Spare",
        date: "2024-10-16",
        dek: "Poems set in 11 point. Portrait chapbook, 48 pages.",
        module: "Portrait",
        cover: R[2],
        still: S[2],
    },
    {
        id: "X3kJRxUxX",
        title: "Inland Signal",
        date: "2024-08-19",
        dek: "Essays from a dry county. Square format, dust jacket.",
        module: "Square",
        cover: S[3],
        still: B[2],
    },
    {
        id: "zyvPp0qI0",
        title: "Service Stairs",
        date: "2023-12-04",
        dek: "A novella in one signature. Portrait, letterpress cover.",
        module: "Portrait",
        cover: R[0],
        still: P[3],
    },
]

const cmds = [
    'SET t2sbY17Aq name="Edition";',
    'SET yAd2lMDSW name="Edition List" collectionList.collection="Edition";',
    'SET FZFYEKdG1 name="Edition" path="/edition/:Edition";',
    'SET O2btPltNw link.href="/edition/:Edition" link.collectionItem="var(--variable-N_XD2ACYK)";',
]
for (const e of editions) {
    cmds.push(
        `SET ${e.id} $control__title="${e.title}" $control__date="${e.date}" $control__description="${e.dek}" $control__featured="true" $control__module="${e.module}" $control__cover.src="${e.cover.url}" $control__cover.alt="${e.cover.alt}" $control__still.src="${e.still.url}" $control__still.alt="${e.still.alt}";`
    )
}

const r = await framer.agent.applyChanges(cmds.join(" "), { pagePath: "/" })
console.log(JSON.stringify(r, null, 2))

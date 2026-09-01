const paper = "var(--token-14d41f00-d3b3-4455-b994-8566aa84333e)"
const imgs = JSON.parse(
    require("fs").readFileSync(
        "/Users/noel/Desktop/Framer/.tmp/col-images.json",
        "utf8"
    )
)
const series = [
    {
        id: "itGlass01",
        title: "Glass Hours",
        date: "2025-03-14",
        dek: "A house that is mostly glass. The trees come in across the floor.",
        module: "Square",
        cover: 0,
        still: 1,
    },
    {
        id: "itUnmade1",
        title: "Unmade Light",
        date: "2025-06-23",
        dek: "Linen and an unmade bed. A clothing brief that stayed in the room.",
        module: "Landscape",
        cover: 2,
        still: 3,
    },
    {
        id: "itFit0001",
        title: "The Fitting",
        date: "2024-10-16",
        dek: "A fitting room that kept the daylight. Pins on the sill.",
        module: "Portrait",
        cover: 6,
        still: 7,
    },
    {
        id: "itNight01",
        title: "Night Atlas",
        date: "2024-11-02",
        dek: "Fog on the chairs. The building held its own weather.",
        module: "Cluster",
        cover: 4,
        still: 5,
    },
    {
        id: "itSalt001",
        title: "Salt Light",
        date: "2025-01-08",
        dek: "Coast light through a dry room. The window did the rest.",
        module: "Landscape",
        cover: 8,
        still: 9,
    },
    {
        id: "itInland1",
        title: "Inland Signal",
        date: "2024-08-19",
        dek: "A road that ended in dust. Someone kept walking.",
        module: "Square",
        cover: 6,
        still: 0,
    },
    {
        id: "itStairs1",
        title: "Service Stairs",
        date: "2023-12-04",
        dek: "Concrete down to a door that never quite closed.",
        module: "Portrait",
        cover: 8,
        still: 9,
    },
    {
        id: "itPool001",
        title: "Late Pool",
        date: "2025-02-11",
        dek: "Steam over tile. The hour after the last swim.",
        module: "Cluster",
        cover: 10,
        still: 11,
    },
]

const cmds = [`SET WQLkyLRf1 fill="${paper}";`]
for (const s of series) {
    const cover = imgs[s.cover]
    const still = imgs[s.still]
    cmds.push(`+CollectionItemNode ${s.id} parent="t2sbY17Aq";`)
    cmds.push(
        `SET ${s.id} $control__title="${s.title}" $control__date="${s.date}" $control__description="${s.dek}" $control__featured="true" $control__module="${s.module}" $control__cover.src="${cover.url}" $control__cover.alt="${cover.alt}" $control__still.src="${still.url}" $control__still.alt="${still.alt}";`
    )
}

const r = await framer.agent.applyChanges(cmds.join(" "), { pagePath: "/" })
console.log(JSON.stringify(r, null, 2))

const clay = await framer.agent.queryImages({
    source: "unsplash",
    query: "handmade ceramic pottery on wood table",
    count: 4,
    orientation: "squarish",
    width: 1400,
})
const C = (clay?.results || []).map((b) => ({ url: b.url, alt: b.alt || "ceramic" }))

const extra = await framer.agent.queryImages({
    source: "unsplash",
    query: "small ceramic cup workshop",
    count: 4,
    orientation: "landscape",
    width: 1400,
})
const E = (extra?.results || []).map((b) => ({ url: b.url, alt: b.alt || "ceramic" }))

const pick = (a, b, i) => a[i] || b[i] || a[0] || b[0]

const d2 = pick(C, E, 0)
const d3 = pick(C, E, 1)
const d4 = pick(C, E, 2)
const d5 = pick(C, E, 3)

if (!d2?.url) {
    console.log(JSON.stringify({ clay: C.length, extra: E.length, clayRaw: clay }, null, 2))
} else {
    const r = await framer.agent.applyChanges(
        [
            `SET tZytgw_pu $control__title="Dish Two" $control__date="2025-03-14" $control__description="A small clay dish. The foot is still wet in the photo." $control__featured="true" $control__module="Square" $control__cover.src="${d2.url}" $control__cover.alt="${d2.alt}" $control__still.src="${d3.url}" $control__still.alt="${d3.alt}";`,
            `SET EDUlD2m19 $control__title="Cup Lip" $control__date="2024-11-02" $control__description="Thrown cup, lip cut after the last pull." $control__featured="true" $control__module="Cluster" $control__cover.src="${d4.url}" $control__cover.alt="${d4.alt}" $control__still.src="${d5.url}" $control__still.alt="${d5.alt}";`,
            `SET X3kJRxUxX $control__title="Square Tray" $control__date="2024-08-19" $control__description="A square tray in pale clay. No glaze yet." $control__featured="true" $control__module="Square" $control__cover.src="${d3.url}" $control__cover.alt="${d3.alt}" $control__still.src="${d2.url}" $control__still.alt="${d2.alt}";`,
        ].join(" "),
        { pagePath: "/" }
    )
    console.log(JSON.stringify({ clay: C.length, extra: E.length, r }, null, 2))
}

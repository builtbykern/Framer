const only = await framer.agent.applyChanges(
    'SET NoEH4ZcYo initialValue="Dish Two"; SET iXNR1Kgi9 initialValue="A small clay dish. The foot is still wet in the photo."; SET aunFimfCw initialValue="2025-03-14T00:00:00.000Z";',
    { pagePath: "/" }
)

const ring = await framer.agent.queryImages({
    source: "unsplash",
    query: "gold ring on linen",
    count: 2,
    orientation: "squarish",
    width: 1400,
})
const R = ring?.results || []

let img = null
if (R[0]?.url) {
    img = await framer.agent.applyChanges(
        `SET lkZBIAg86 $control__cover.src="${R[0].url}" $control__cover.alt="${String(R[0].alt || "gold ring").replace(/"/g, "")}";`,
        { pagePath: "/" }
    )
}

const nav = await framer.agent.serializeNodes({
    ids: ["GiR6fF7o5", "Nx5jccWgM", "tKUMOkWpP", "augiA20Il"],
    depth: 0,
    attributeFilter: ["left", "width", "layoutTemplate", "name"],
})

const controls = await framer.agent.readComponentControls({
    componentIds: ["OdvHkNWXz"],
})

console.log(
    JSON.stringify(
        {
            only,
            rings: R.length,
            img,
            nav: nav.map((n) => ({
                id: n.id,
                name: n.name,
                left: n.attributes?.left,
                width: n.attributes?.width,
                layout: n.attributes?.layoutTemplate,
            })),
            titleDefault: controls.OdvHkNWXz.controls.$control__title.defaultValue,
        },
        null,
        2
    )
)

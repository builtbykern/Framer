const ring = await framer.agent.queryImages({
    source: "unsplash",
    query: "gold ring closeup on linen cloth",
    count: 2,
    orientation: "landscape",
    width: 1600,
})
const bench = await framer.agent.queryImages({
    source: "unsplash",
    query: "metalworking file jewelry bench closeup no people",
    count: 2,
    orientation: "portrait",
    width: 1200,
})
const R = (ring?.results || []).map((b) => ({ url: b.url, alt: b.alt || "ring" }))
const B = (bench?.results || []).map((b) => ({ url: b.url, alt: b.alt || "bench" }))

const cmds = [
    'SET augiA20Il layoutTemplate="null";',
    'SET GiR6fF7o5 left="0px" width="1440px";',
    'SET Nx5jccWgM left="1540px" width="810px";',
    'SET tKUMOkWpP left="2450px" width="390px";',
    'SET eGJAoz6x_ layout="stack" position="relative" width="1fr" height="1px";',
    'SET S4aeyJLQaebjghUxzc textStylePreset="Label" width="100%" height="auto";',
    'SET ebjghUxzc textStylePreset="Label";',
    'SET NoEH4ZcYo initialValue="Dish Two";',
    'SET iXNR1Kgi9 initialValue="A small clay dish. The foot is still wet in the photo.";',
    'SET pWw0UM2JG height="auto";',
    'SET w02m12a91 height="auto";',
    'SET U9F5gXIMe height="auto";',
    'SET yAd2lMDSW overflow="auto" hideScrollbars="true";',
    'SET t62LHpSTayAd2lMDSW overflow="auto" hideScrollbars="true";',
    'SET u75vHQkARyAd2lMDSW overflow="auto" hideScrollbars="true";',
]

if (R[0]?.url && B[0]?.url) {
    cmds.push(
        `SET lkZBIAg86 $control__cover.src="${R[0].url}" $control__cover.alt="${String(R[0].alt).replace(/"/g, "")}" $control__still.src="${B[0].url}" $control__still.alt="${String(B[0].alt).replace(/"/g, "")}";`
    )
}

const fix = await framer.agent.applyChanges(cmds.join(" "), { pagePath: "/" })
const controls = await framer.agent.readComponentControls({
    componentIds: ["OdvHkNWXz"],
})
console.log(
    JSON.stringify(
        { rings: R.length, bench: B.length, fix, defaults: controls.OdvHkNWXz.controls },
        null,
        2
    )
)

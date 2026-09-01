const pagePath = "/"
const desktop = await framer.agent.serialize({ id: "WQLkyLRf1", depth: 6 }, { pagePath })
const instance = await framer.agent.serialize({ id: "RgnF7Pl9M", depth: 1 }, { pagePath })
const bg = await framer.agent.serialize({ id: "VD3cBZNuk", depth: 4 }, { pagePath })
const wrap = await framer.agent.serialize({ id: "hvoU9CXen", depth: 3 }, { pagePath })
const controls = await framer.agent.readComponentControls({
    componentIds: ["codeFile/NRC55li:default"],
})
const shot = await framer.agent.readProject(
    [{ type: "screenshot", id: "WQLkyLRf1" }],
    { pagePath }
)
console.log(
    JSON.stringify(
        {
            desktop: {
                id: desktop.id,
                attrs: desktop.attributes,
                kids: (desktop.children || []).map((c) => c.id),
            },
            bgAttrs: bg.attributes,
            bgKids: (bg.children || []).map((c) => ({
                id: c.id,
                type: c.type,
                name: c.name,
                attrs: c.attributes,
            })),
            wrapAttrs: wrap.attributes,
            instanceAttrs: instance.attributes,
            controlTitles: (controls.controls || controls["codeFile/NRC55li:default"]?.controls || [])
                .slice?.(0, 5),
            controlsRaw: JSON.stringify(controls).slice(0, 4000),
            shot: shot?.results?.[0]
                ? Object.keys(shot.results[0])
                : shot,
        },
        null,
        2
    )
)

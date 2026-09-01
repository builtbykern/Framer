/**
 * Deep Nav open: Main links, Footer, compare pads across open variants.
 */
const ser = await framer.agent.serialize({ id: "ynpqYJGOd", depth: 8 }, {})

function collect(n, trail = [], acc = []) {
    if (!n) return acc
    const a = n.attributes || {}
    acc.push({
        trail: [...trail, n.name || "(x)"].join(" / "),
        id: n.id,
        name: n.name,
        w: a.width ?? null,
        mw: a.maxWidth ?? null,
        h: a.height ?? null,
        pad: a.padding ?? null,
        gap: a.gap ?? null,
        pos: a.position ?? null,
        fill: a.fill ? String(a.fill).slice(0, 40) : null,
        align: a.stackAlignment ?? null,
        dist: a.stackDistribution ?? null,
        dir: a.stackDirection ?? null,
    })
    for (const c of n.children || []) collect(c, [...trail, n.name || "(x)"], acc)
    return acc
}

const opens = {}
for (const v of ser.children || []) {
    if (!/Open/i.test(v.name || "")) continue
    const nodes = collect(v)
    // focus on layout-critical
    opens[v.name] = {
        root: nodes[0],
        focus: nodes.filter((n) =>
            /top|container|Drawer|Main|Footer|link|Link|nav|Item|List|Column|Split|Grain/i.test(
                n.name || ""
            )
        ),
        allWithPad: nodes.filter((n) => n.pad),
        all90: nodes.filter((n) => n.w === "90%" || n.mw === "90%"),
    }
}

// Also Desktop close for compare
const desk = (ser.children || []).find((v) => v.name === "Desktop")
const deskNodes = desk ? collect(desk) : []

return {
    opens,
    desktopCloseTop: deskNodes.find((n) => n.name === "top"),
    desktopCloseRoot: deskNodes[0],
}

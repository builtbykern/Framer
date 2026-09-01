const pages = await framer.getNodesWithType("WebPageNode")

function collectImages(n, trail, acc = []) {
    if (!n) return acc
    const a = n.attributes || {}
    const name = n.name || ""
    // image fills / controls
    if (a.fill && typeof a.fill === "string" && a.fill.includes("framerusercontent.com/images")) {
        acc.push({ trail: trail.join(">"), id: n.id, name, fill: a.fill, type: "fill" })
    }
    if (a.$control__image) {
        const img = a.$control__image
        const src = typeof img === "string" ? img : img?.src
        if (src) acc.push({ trail: trail.join(">"), id: n.id, name, fill: src, type: "control", alt: img?.alt })
    }
    for (const c of n.children || []) collectImages(c, trail.concat(name || n.type), acc)
    return acc
}

const out = {}
for (const path of ["/", "/about", "/properties"]) {
    const p = pages.find((x) => x.path === path)
    const ser = await framer.agent.serialize({ id: p.id, depth: 7 }, {})
    const desk = ser.children.find((c) => c.name === "Desktop")
    out[path] = {
        tops: (desk.children || []).slice(0, 8).map((c) => c.name),
        images: collectImages(desk, ["Desktop"]).slice(0, 20),
    }
}

// Properties hero pads
const props = pages.find((p) => p.path === "/properties")
const serP = await framer.agent.serialize({ id: props.id, depth: 5 }, {})
const propHero = []
for (const bp of serP.children || []) {
    function find(n) {
        if (!n) return null
        if (n.name === "Properties Hero") return n
        for (const c of n.children || []) {
            const f = find(c)
            if (f) return f
        }
        return null
    }
    const h = find(bp)
    const copy = h && (h.children || []).find((c) => c.name === "Hero Copy")
    propHero.push({
        bp: bp.name,
        heroId: h?.id,
        heroPad: h?.attributes?.padding,
        copyId: copy?.id,
        copyPad: copy?.attributes?.padding,
        gap: h?.attributes?.gap,
    })
}

// About hero / beat 1 images
const about = pages.find((p) => p.path === "/about")
const serA = await framer.agent.serialize({ id: about.id, depth: 6 }, {})
const aboutHero = []
for (const bp of serA.children || []) {
    const beats = (bp.children || []).filter((c) => /Beat|Portrait|Opening|Hero/i.test(c.name || ""))
    aboutHero.push({
        bp: bp.name,
        beats: beats.map((b) => ({
            name: b.name,
            id: b.id,
            pad: b.attributes?.padding,
            kids: (b.children || []).map((c) => c.name),
        })),
    })
}

return { homeImgs: out["/"].images.slice(0, 8), aboutImgs: out["/about"].images.slice(0, 12), propHero, aboutHero }

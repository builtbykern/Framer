const pages = await framer.getNodesWithType("WebPageNode")
const HOME_IMG = "5Ytxn8avZFwlwp4Ng3t8PDU56Lk" // known home terrace dusk

function walk(n, trail, acc) {
    if (!n) return
    const a = n.attributes || {}
    const name = n.name || ""
    const fill = a.fill
    const ctrl = a.$control__image
    const src = typeof ctrl === "object" ? ctrl?.src : ctrl
    if (typeof fill === "string" && fill.includes("images/")) {
        acc.push({ trail: [...trail, name].join(" > "), id: n.id, kind: "fill", src: fill, name })
    }
    if (typeof src === "string" && src.includes("images/")) {
        acc.push({
            trail: [...trail, name].join(" > "),
            id: n.id,
            kind: "control",
            src,
            name,
            alt: typeof ctrl === "object" ? ctrl.alt : null,
        })
    }
    // also backgroundImage etc
    for (const c of n.children || []) walk(c, [...trail, name || n.type], acc)
}

const result = {}
for (const path of ["/", "/about"]) {
    const p = pages.find((x) => x.path === path)
    const ser = await framer.agent.serialize({ id: p.id, depth: 8 }, {})
    const desk = ser.children.find((c) => c.name === "Desktop")
    const acc = []
    walk(desk, ["Desktop"], acc)
    result[path] = acc
}

// Find Opening Image Field specifically
const about = pages.find((p) => p.path === "/about")
const serA = await framer.agent.serialize({ id: about.id, depth: 8 }, {})
const deskA = serA.children.find((c) => c.name === "Desktop")
const opening = []
function findOpening(n) {
    if (!n) return
    if (/Opening Image|Inertia|Entrance|Beat 1|Portrait/i.test(n.name || "")) {
        opening.push({
            id: n.id,
            name: n.name,
            type: n.type,
            component: n.component,
            fill: n.attributes?.fills || n.attributes?.fill,
            image: n.attributes?.$control__image,
            kids: (n.children || []).map((c) => c.name),
        })
    }
    for (const c of n.children || []) findOpening(c)
}
findOpening(deskA)

// CMS / project assets we could use - list unique images already in about vs home
const homeSrcs = new Set(result["/"].map((x) => x.src))
const aboutDupes = result["/about"].filter((x) => homeSrcs.has(x.src) || String(x.src).includes(HOME_IMG))

return { home: result["/"], aboutDupes, opening, aboutAll: result["/about"] }

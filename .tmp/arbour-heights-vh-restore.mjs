/**
 * Restore media heights using vh (scales with viewport) after aspectRatio failed to persist.
 * Desktop gets generous vh; Tablet/Phone slightly less so they don't dominate.
 */
const pages = await framer.getNodesWithType("WebPageNode")
const comps = await framer.getNodesWithType("ComponentNode")
const lines = []
const notes = []

function set(id, prop, val, note) {
    lines.push(`SET ${id} ${prop}="${val}";`)
    notes.push(note)
}

function findAll(n, pred, out = [], d = 0) {
    if (!n || d > 8) return out
    if (pred(n)) out.push(n)
    for (const c of n.children || []) findAll(c, pred, out, d + 1)
    return out
}

const pageTargets = [
    // [path, name, { Desktop, Tablet, Phone }]
    ["/about", "Beat 2 — Cinematic Image", { Desktop: "62vh", Tablet: "52vh", Phone: "48vh" }],
    ["/contact", "Contact Hero", { Desktop: "52vh", Tablet: "48vh", Phone: "auto" }],
    ["/notes/:slug", "Journal Hero Image", { Desktop: "48vh", Tablet: "40vh", Phone: "32vh" }],
    ["/neighbourhoods", "Territory Photograph", { Desktop: "36vh", Tablet: "30vh", Phone: "26vh" }],
    ["/properties/:slug", "Gallery Image One", { Desktop: "52vh", Tablet: "40vh", Phone: "32vh" }],
    ["/properties/:slug", "Gallery Image Two", { Desktop: "28vh", Tablet: "24vh", Phone: "20vh" }],
    ["/properties/:slug", "Gallery Image Three", { Desktop: "28vh", Tablet: "24vh", Phone: "20vh" }],
]

for (const [path, name, byBp] of pageTargets) {
    const p = pages.find((x) => x.path === path)
    if (!p) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 7 }, {})
    for (const bp of ser.children || []) {
        const h = byBp[bp.name]
        if (!h) continue
        for (const n of findAll(bp, (x) => x.name === name)) {
            set(n.id, "height", h, `${path}|${bp.name}|${name} →${h}`)
            // clear broken aspect if present
            if (n.attributes?.aspectRatio) {
                set(n.id, "aspectRatio", "null", `${path}|${bp.name}|${name} clear aspect`)
            }
        }
    }
}

// Contact Phone hero: use minHeight instead of tiny auto
{
    const p = pages.find((x) => x.path === "/contact")
    const ser = await framer.agent.serialize({ id: p.id, depth: 4 }, {})
    const phone = (ser.children || []).find((b) => b.name === "Phone")
    if (phone) {
        for (const n of findAll(phone, (x) => x.name === "Contact Hero")) {
            set(n.id, "height", "auto", `contact|Phone|Contact Hero h→auto`)
            set(n.id, "minHeight", "70vh", `contact|Phone|Contact Hero minH→70vh`)
        }
    }
}

// Footer rail — restore staggered px heights (scaled), vh doesn't preserve stagger well per-cell
const railHeights = {
    Desktop: {
        "Rail Property 01": 260,
        "Rail Property 02": 210,
        "Rail Property 03": 320,
        "Rail Property 04": 230,
        "Rail Property 05": 290,
        "Rail Property 06": 220,
    },
    Tablet: {
        "Rail Property 01": 185,
        "Rail Property 02": 148,
        "Rail Property 03": 230,
        "Rail Property 04": 170,
        "Rail Property 05": 150,
        "Rail Property 06": 113,
    },
    Phone: {
        "Rail Property 01": 128,
        "Rail Property 02": 99,
        "Rail Property 03": 156,
        "Rail Property 04": 73,
        "Rail Property 05": 92,
        "Rail Property 06": 68,
    },
}

{
    const footer = comps.find((c) => c.name === "Footer")
    const ser = await framer.agent.serialize({ id: footer.id, depth: 5 }, {})
    for (const bp of ser.children || []) {
        const map = railHeights[bp.name]
        if (!map) continue
        const rail = (bp.children || []).find((c) =>
            /Editorial Property Rail/i.test(c.name || ""),
        )
        if (!rail) continue
        set(rail.id, "height", "auto", `Footer|${bp.name}|rail h→auto`)
        for (const item of rail.children || []) {
            const h = map[item.name]
            if (!h) continue
            set(item.id, "height", `${h}px`, `Footer|${bp.name}|${item.name} →${h}`)
            if (item.attributes?.aspectRatio) {
                set(item.id, "aspectRatio", "null", `${item.name} clear aspect`)
            }
            const walk = (n, d = 0) => {
                if (!n || d > 3) return
                if (n.id !== item.id && (n.attributes?.height === "1fr" || n.attributes?.minHeight != null || n.attributes?.collectionList)) {
                    set(n.id, "minHeight", `${h}px`, `${item.name} minH→${h}`)
                }
                for (const c of n.children || []) walk(c, d + 1)
            }
            walk(item, 0)
        }
    }
}

// PrincipalProfile + Neighbourhood Feature — restore px from design with slight bump
{
    const c = comps.find((x) => x.name === "Arbour_PrincipalProfile")
    if (c) {
        const ser = await framer.agent.serialize({ id: c.id, depth: 4 }, {})
        for (const bp of ser.children || []) {
            for (const n of findAll(bp, (x) => x.name === "Portrait")) {
                set(n.id, "height", "650px", `Principal|${bp.name}|Portrait →650`)
                set(n.id, "width", "520px", `Principal|${bp.name}|Portrait w520`)
            }
        }
    }
}
{
    const c = comps.find((x) => x.name === "Arbour Neighbourhood Feature")
    if (c) {
        const ser = await framer.agent.serialize({ id: c.id, depth: 4 }, {})
        for (const bp of ser.children || []) {
            for (const n of findAll(bp, (x) => x.name === "Neighbourhood Main Image")) {
                set(n.id, "height", "364px", `NeighFeat|${bp.name}|Main →364`)
            }
            for (const n of findAll(bp, (x) => x.name === "Neighbourhood Detail Image")) {
                set(n.id, "height", "244px", `NeighFeat|${bp.name}|Detail →244`)
            }
        }
    }
}

const seen = new Set()
const uniq = []
for (const l of lines) {
    if (seen.has(l)) continue
    seen.add(l)
    uniq.push(l)
}

const NL = "\n"
const results = []
for (let i = 0; i < uniq.length; i += 35) {
    const r = await framer.agent.applyChanges(uniq.slice(i, i + 35).join(NL), {})
    results.push(r?.message || String(r))
}

return { applied: uniq.length, sample: notes.slice(0, 35), results }

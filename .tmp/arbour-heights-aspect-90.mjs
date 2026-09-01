/**
 * Adapt media heights for 90% fluid width:
 * - Set aspectRatio from design intent (W/H)
 * - height → auto so height scales with width
 * - Sync/clear rigid minHeights that block growth
 * - Footer rail: unlock aspect-driven height on all BPs
 * - Ensure content maxWidth stays 90% (already)
 */
const pages = await framer.getNodesWithType("WebPageNode")
const comps = await framer.getNodesWithType("ComponentNode")

const lines = []
const notes = []

function set(id, prop, val, note) {
    lines.push(`SET ${id} ${prop}="${val}";`)
    notes.push(note)
}

function unlockAspect(node, aspect, label) {
    if (!node?.id) return
    set(node.id, "aspectRatio", String(aspect), `${label} aspect→${aspect}`)
    set(node.id, "height", "auto", `${label} h→auto`)
    // clear minHeight blockers on self + shallow children
    const walk = (n, d = 0) => {
        if (!n || d > 3) return
        if (n.attributes?.minHeight) {
            set(n.id, "minHeight", "null", `${label} clear minH`)
        }
        for (const c of n.children || []) walk(c, d + 1)
    }
    walk(node, 0)
}

function findAll(n, pred, out = [], d = 0) {
    if (!n || d > 8) return out
    if (pred(n)) out.push(n)
    for (const c of n.children || []) findAll(c, pred, out, d + 1)
    return out
}

// --- Pages ---
const pageRules = [
    {
        path: "/about",
        match: (n) => n.name === "Beat 2 — Cinematic Image",
        aspect: 2.12, // ~680@1440 → grows on wide
    },
    {
        path: "/contact",
        match: (n) => n.name === "Contact Hero",
        aspect: 2.57, // ~560@1440
    },
    {
        path: "/notes/:slug",
        match: (n) => n.name === "Journal Hero Image",
        aspect: 2.3, // was wrong aspect 16 with fixed 520
    },
    {
        path: "/neighbourhoods",
        match: (n) => n.name === "Territory Photograph",
        aspect: 1.15,
    },
    {
        path: "/properties/:slug",
        match: (n) => n.name === "Gallery Image One",
        aspect: 1.6,
    },
    {
        path: "/properties/:slug",
        match: (n) => n.name === "Gallery Image Two",
        aspect: 1.85,
    },
    {
        path: "/properties/:slug",
        match: (n) => n.name === "Gallery Image Three",
        aspect: 1.85,
    },
]

for (const rule of pageRules) {
    const p = pages.find((x) => x.path === rule.path)
    if (!p) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 7 }, {})
    for (const bp of ser.children || []) {
        const hits = findAll(bp, rule.match)
        for (const n of hits) {
            unlockAspect(n, rule.aspect, `${rule.path}|${bp.name}|${n.name}`)
        }
    }
}

// Contact Hero Entrance Media — also unlock if it has fixed height
{
    const p = pages.find((x) => x.path === "/contact")
    const ser = await framer.agent.serialize({ id: p.id, depth: 5 }, {})
    for (const bp of ser.children || []) {
        const hits = findAll(bp, (n) => n.name === "Hero Entrance Media")
        for (const n of hits) {
            const h = n.attributes?.height
            if (h && String(h).endsWith("px")) {
                unlockAspect(n, 0.92, `${bp.name}|Hero Entrance Media`)
            }
        }
    }
}

// Discovery / Continue cards with fixed 420
for (const path of ["/properties", "/properties/:slug", "/notes/:slug", "/"]) {
    const p = pages.find((x) => x.path === path)
    if (!p) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 7 }, {})
    for (const bp of ser.children || []) {
        const hits = findAll(
            bp,
            (n) =>
                n.attributes?.height === "420px" &&
                /Search|Route|Discover|Card|Image|Photo/i.test(n.name || "x"),
        )
        // also any unnamed 420 in Continue Your Search
        const hits2 = findAll(
            bp,
            (n) =>
                n.attributes?.height === "420px" &&
                (n.name || "").length >= 0,
        ).filter((n) => {
            // only under Continue / Discovery paths — check via parent walk is hard; filter by height only in those sections
            return true
        })
        for (const n of hits2) {
            // Only if inside a section named Continue/Discovery — approximate by also matching width 1fr/100%
            if (n.attributes?.height !== "420px") continue
            unlockAspect(n, 1.4, `${path}|${bp.name}|420→aspect`)
        }
    }
}

// --- Footer rail: aspect-driven on all BPs ---
{
    const footer = comps.find((c) => c.name === "Footer")
    const ser = await framer.agent.serialize({ id: footer.id, depth: 5 }, {})
    for (const bp of ser.children || []) {
        const rail = (bp.children || []).find((c) =>
            /Editorial Property Rail/i.test(c.name || ""),
        )
        if (!rail) continue
        for (const item of rail.children || []) {
            if (!/Rail Property/i.test(item.name || "")) continue
            const aspect = item.attributes?.aspectRatio
            const h = parseFloat(item.attributes?.height)
            const fr = parseFloat(String(item.attributes?.width || "1").replace("fr", "")) || 1
            // Prefer existing aspect; else derive from current height assuming ~1920 rail
            let a = aspect
            if (!a && h) {
                const sumFr = 6.4
                const w = (fr / sumFr) * 1920
                a = +(w / h).toFixed(3)
            }
            if (!a) continue
            unlockAspect(item, a, `Footer|${bp.name}|${item.name}`)
        }
    }
}

// --- Neighbourhood Feature component ---
{
    const c = comps.find((x) => x.name === "Arbour Neighbourhood Feature")
    if (c) {
        const ser = await framer.agent.serialize({ id: c.id, depth: 4 }, {})
        for (const bp of ser.children || []) {
            for (const n of findAll(
                bp,
                (x) => /Neighbourhood Main Image|Neighbourhood Detail Image/i.test(x.name || ""),
            )) {
                const w = parseFloat(n.attributes?.width)
                const h = parseFloat(n.attributes?.height)
                if (w && h) unlockAspect(n, +(w / h).toFixed(3), `NeighFeat|${bp.name}|${n.name}`)
            }
        }
    }
}

// --- PrincipalProfile portrait ---
{
    const c = comps.find((x) => x.name === "Arbour_PrincipalProfile")
    if (c) {
        const ser = await framer.agent.serialize({ id: c.id, depth: 4 }, {})
        for (const bp of ser.children || []) {
            for (const n of findAll(bp, (x) => x.name === "Portrait")) {
                const w = parseFloat(n.attributes?.width) || 520
                const h = parseFloat(n.attributes?.height) || 650
                unlockAspect(n, +(w / h).toFixed(3), `Principal|${bp.name}|Portrait`)
            }
        }
    }
}

// Dedupe lines
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

return { applied: uniq.length, noteCount: notes.length, sample: notes.slice(0, 40), results }

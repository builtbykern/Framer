/**
 * Deep fix pass: all pages × BPs
 * 1) Phone Bottom 390→90%
 * 2) Fixed px section/media heights → vh
 * 3) Ensure filled-shell children have 90%
 * 4) Property/Notes detail shells consistency
 * 5) Scan Portfolio/Properties/Notes/About image frames with fixed px
 */
const CONTENT = [
    "/",
    "/properties",
    "/neighbourhoods",
    "/notes",
    "/about",
    "/contact",
    "/properties/:slug",
    "/notes/:slug",
]

const pages = await framer.getNodesWithType("WebPageNode")
const comps = await framer.getNodesWithType("ComponentNode")
const lines = []
const notes = []

function set(id, prop, val, note) {
    lines.push(`SET ${id} ${prop}="${val}";`)
    notes.push(note)
}

function hasFill(a = {}) {
    const f = a.backgroundColor ?? a.fill ?? null
    return !!(f && f !== "null" && f !== "none" && f !== "")
}

function findAll(n, pred, out = [], d = 0) {
    if (!n || d > 8) return out
    if (pred(n)) out.push(n)
    for (const c of n.children || []) findAll(c, pred, out, d + 1)
    return out
}

// --- Pass 1: top-level + known issues ---
for (const path of CONTENT) {
    const p = pages.find((x) => x.path === path)
    if (!p) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 7 }, {})

    for (const bp of ser.children || []) {
        for (const c of bp.children || []) {
            const name = c.name || ""
            const a = c.attributes || {}

            // Phone Bottom maxW 390
            if (name === "Bottom" && a.maxWidth && a.maxWidth !== "90%" && a.maxWidth !== "100%") {
                // Bottom is filled — clear maxW on shell, ensure Content child 90%
                if (hasFill(a)) {
                    set(c.id, "maxWidth", "null", `${path}|${bp.name}|Bottom clear maxW`)
                } else {
                    set(c.id, "maxWidth", "90%", `${path}|${bp.name}|Bottom →90%`)
                }
            }

            // Tablet/Phone Hero Section fixed px
            if (name === "Hero Section" && a.height && String(a.height).endsWith("px")) {
                const vhMap = { Tablet: "70vh", Phone: "75vh", Desktop: "100vh" }
                const h = vhMap[bp.name] || "70vh"
                set(c.id, "height", h, `${path}|${bp.name}|Hero →${h}`)
            }

            // Testimonial fixed height
            if (name === "Testimonial Section" && a.height && String(a.height).endsWith("px")) {
                set(c.id, "height", "auto", `${path}|${bp.name}|Testimonial h→auto`)
                set(c.id, "minHeight", "40vh", `${path}|${bp.name}|Testimonial minH→40vh`)
            }

            // Filled shells: clear maxW, kids → 90%
            if (hasFill(a) && !/Atmosphere|Nav|Footer|Hero Section|Beat 2|Cinematic Image|Journal Hero Image/i.test(name)) {
                if (a.maxWidth) {
                    set(c.id, "maxWidth", "null", `${path}|${bp.name}|${name} clear shell maxW`)
                }
                if (a.width && /^\d/.test(a.width) && a.width.endsWith("px")) {
                    set(c.id, "width", "100%", `${path}|${bp.name}|${name} w→100%`)
                }
                for (const ch of c.children || []) {
                    if (ch.attributes?.position === "absolute") continue
                    if (ch.attributes?.maxWidth !== "90%") {
                        set(ch.id, "maxWidth", "90%", `${path}|${bp.name}|${name}>${ch.name || "?"} →90%`)
                    }
                }
            }

            // Unfilled content sections missing 90%
            if (
                !hasFill(a) &&
                /Section|Journal|Manifesto|Opening|Chapter|Enquiry|Contact|Portfolio|Process|Recognition|Testimonial|Stats|Particulars|Gallery|Setting|Search|Strip|Pause|Beat|Content|Hero|Closing|Specs|Article|Column|Bottom/i.test(
                    name,
                ) &&
                name !== "Footer" &&
                a.maxWidth !== "90%" &&
                a.maxWidth !== "100%"
            ) {
                set(c.id, "maxWidth", "90%", `${path}|${bp.name}|${name} →90%`)
            }
        }

        // Deep: fixed px heights on image-like frames → vh
        const mediaPred = (n) => {
            const nm = n.name || ""
            const h = n.attributes?.height
            if (!h || !String(h).endsWith("px")) return false
            const nH = parseFloat(h)
            if (nH < 140) return false
            return /Image|Photo|Media|Portrait|Hero|Gallery|Card|Photograph|Field|Opening Image|Residence|Property Image|Feature|Cover|Banner/i.test(
                nm,
            )
        }

        const media = findAll(bp, mediaPred)
        for (const n of media) {
            const nH = parseFloat(n.attributes.height)
            // Map px → vh roughly (design ~1080): clamp 22–70vh
            let vh = Math.round((nH / 1080) * 100)
            vh = Math.max(22, Math.min(70, vh))
            // Boost a bit for large screens feeling
            if (bp.name === "Desktop") vh = Math.min(70, vh + 6)
            set(
                n.id,
                "height",
                `${vh}vh`,
                `${path}|${bp.name}|${n.name || n.id} ${nH}px→${vh}vh`,
            )
        }

        // Unnamed fixed-height frames under heroes / galleries / continue (≥180px)
        const tallUnnamed = findAll(
            bp,
            (n) =>
                !n.name &&
                n.attributes?.height &&
                String(n.attributes.height).endsWith("px") &&
                parseFloat(n.attributes.height) >= 180,
        )
        for (const n of tallUnnamed) {
            const nH = parseFloat(n.attributes.height)
            let vh = Math.round((nH / 1080) * 100) + (bp.name === "Desktop" ? 8 : 4)
            vh = Math.max(24, Math.min(55, vh))
            set(n.id, "height", `${vh}vh`, `${path}|${bp.name}|unnamed ${nH}px→${vh}vh`)
        }
    }
}

// --- Components: Neighbourhood Feature, PrincipalProfile, Services card ---
for (const cname of [
    "Arbour Neighbourhood Feature",
    "Arbour_PrincipalProfile",
    "Services card",
    "Arbour_OfficeAtlasPanel",
]) {
    const c = comps.find((x) => x.name === cname)
    if (!c) continue
    const ser = await framer.agent.serialize({ id: c.id, depth: 5 }, {})
    for (const bp of ser.children || []) {
        const media = findAll(
            bp,
            (n) =>
                n.attributes?.height &&
                String(n.attributes.height).endsWith("px") &&
                parseFloat(n.attributes.height) >= 140 &&
                /Image|Photo|Portrait|Media|Picture/i.test(n.name || "Image"),
        )
        for (const n of media) {
            const nH = parseFloat(n.attributes.height)
            let vh = Math.round((nH / 1080) * 100) + 4
            vh = Math.max(20, Math.min(65, vh))
            // Principal portrait: keep aspect-ish via min vh
            if (/Portrait/i.test(n.name || "")) {
                set(n.id, "height", "auto", `${cname}|${bp.name}|Portrait h→auto`)
                set(n.id, "minHeight", "55vh", `${cname}|${bp.name}|Portrait minH→55vh`)
                // keep width or use %
                if (n.attributes?.width && String(n.attributes.width).endsWith("px")) {
                    set(n.id, "width", "100%", `${cname}|${bp.name}|Portrait w→100%`)
                    set(n.id, "maxWidth", "520px", `${cname}|${bp.name}|Portrait maxW520`)
                }
            } else {
                set(n.id, "height", `${vh}vh`, `${cname}|${bp.name}|${n.name} →${vh}vh`)
            }
        }
    }
}

// Footer rail — bump Desktop further for 90% width feel
{
    const footer = comps.find((c) => c.name === "Footer")
    const ser = await framer.agent.serialize({ id: footer.id, depth: 4 }, {})
    const desk = (ser.children || []).find((b) => b.name === "Desktop")
    const rail = (desk?.children || []).find((c) => /Rail/i.test(c.name || ""))
    const map = {
        "Rail Property 01": "28vh",
        "Rail Property 02": "22vh",
        "Rail Property 03": "34vh",
        "Rail Property 04": "24vh",
        "Rail Property 05": "30vh",
        "Rail Property 06": "23vh",
    }
    for (const item of rail?.children || []) {
        const h = map[item.name]
        if (!h) continue
        set(item.id, "height", h, `Footer|Desktop|${item.name} →${h}`)
        const walk = (n, d = 0) => {
            if (!n || d > 3) return
            if (n.id !== item.id && n.attributes?.minHeight) {
                set(n.id, "minHeight", h, `${item.name} minH→${h}`)
            }
            for (const ch of n.children || []) walk(ch, d + 1)
        }
        walk(item, 0)
    }
}

const seen = new Set()
const uniq = []
const uniqNotes = []
for (let i = 0; i < lines.length; i++) {
    if (seen.has(lines[i])) continue
    seen.add(lines[i])
    uniq.push(lines[i])
    uniqNotes.push(notes[i])
}

const NL = "\n"
const results = []
for (let i = 0; i < uniq.length; i += 40) {
    const r = await framer.agent.applyChanges(uniq.slice(i, i + 40).join(NL), {})
    results.push(r?.message || String(r))
}

return {
    applied: uniq.length,
    noteCount: uniqNotes.length,
    sample: uniqNotes.slice(0, 50),
    results,
}

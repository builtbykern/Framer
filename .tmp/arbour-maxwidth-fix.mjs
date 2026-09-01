/**
 * Apply maxWidth="1200px" to content sections missing it (all BPs).
 * Canon: content shells = 1200px (same as Territories / Recognition / Enquiry).
 * Skip intentional full-bleed (Hero Section).
 * Also: Hero Text Content Column — add maxWidth 1200 so copy aligns with content column on ultrawide.
 */
const CONTENT_SHELLS = [
    { path: "/", name: "Process Section" },
    { path: "/", name: "Arbour_StatsBand" },
    { path: "/notes", name: "Journal Manifesto" },
    { path: "/contact", name: "Contact Hero" },
    { path: "/contact", name: "Contact Opening" },
    { path: "/notes/:slug", name: "Journal Text Column" },
    { path: "/properties/:slug", name: "Property Specs Band" },
    { path: "/properties/:slug", name: "Chapter Intro" },
    { path: "/notes/:slug", name: "Specs Strip" },
    { path: "/notes/:slug", name: "Closing Chapter" },
]

const pages = await framer.getNodesWithType("WebPageNode")
const lines = []
const notes = []

for (const { path, name } of CONTENT_SHELLS) {
    const p = pages.find((x) => x.path === path)
    if (!p) {
        notes.push(`MISSING PAGE ${path}`)
        continue
    }
    const ser = await framer.agent.serialize({ id: p.id, depth: 2 }, {})
    for (const bp of ser.children || []) {
        for (const c of bp.children || []) {
            if (c.name !== name) continue
            const mw = c.attributes?.maxWidth
            if (mw === "1200px") {
                notes.push(`ok ${path}|${bp.name}|${name}`)
                continue
            }
            lines.push(`SET ${c.id} maxWidth="1200px";`)
            notes.push(`SET ${path}|${bp.name}|${name} ${mw || "NONE"}→1200 id=${c.id}`)
        }
    }
}

// Hero Text Content Column — align with 1200 content column on wide viewports
{
    const p = pages.find((x) => x.path === "/")
    const ser = await framer.agent.serialize({ id: p.id, depth: 5 }, {})
    for (const bp of ser.children || []) {
        const hero = (bp.children || []).find((c) => c.name === "Hero Section")
        if (!hero) continue
        const walk = (n) => {
            if (!n) return
            if (n.name === "Text Content Column") {
                const mw = n.attributes?.maxWidth
                if (mw !== "1200px") {
                    lines.push(`SET ${n.id} maxWidth="1200px";`)
                    notes.push(
                        `SET /|${bp.name}|Hero>Text Content Column ${mw || "NONE"}→1200 id=${n.id}`,
                    )
                } else {
                    notes.push(`ok /|${bp.name}|Hero>Text Content Column`)
                }
            }
            for (const c of n.children || []) walk(c)
        }
        walk(hero)
    }
}

if (lines.length === 0) {
    return { applied: 0, notes }
}

const NL = "\n"
const dsl = lines.join(NL)
const result = await framer.agent.applyChanges(dsl, {})
return { applied: lines.length, notes, dslPreview: lines.slice(0, 30), result }

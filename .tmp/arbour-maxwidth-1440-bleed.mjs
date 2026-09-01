/**
 * Fix boxed BGs + migrate content maxWidth 1200 → 1440.
 *
 * Canon:
 * - Section shells WITH fill → no maxWidth (full-bleed BG), width 100%/1fr, align center
 * - Content (shell without fill, OR direct children of filled shells, OR known wrappers) → maxWidth 1440
 * - Footer Editorial Grid + copyright bar → 1440
 * - Leave Atmosphere/Nav/Footer shell uncapped
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

const SKIP_TOP = /Atmosphere|Nav|Cue|ScrollCue|Footer$/i
const FULL_BLEED_SHELL = /Hero Section|^Beat 2|Cinematic Image/i

const pages = await framer.getNodesWithType("WebPageNode")
const comps = await framer.getNodesWithType("ComponentNode")
const lines = []
const notes = []

function hasFill(a = {}) {
    const f = a.backgroundColor ?? a.fill ?? null
    return !!(f && f !== "null" && f !== "none" && f !== "")
}

function setMax(id, value, note) {
    lines.push(`SET ${id} maxWidth="${value}";`)
    notes.push(note)
}

function clearMax(id, note) {
    lines.push(`SET ${id} maxWidth="null";`)
    notes.push(note)
}

function ensureWidthFull(id, cur, note) {
    if (cur !== "100%" && cur !== "1fr") {
        lines.push(`SET ${id} width="100%";`)
        notes.push(note)
    }
}

function ensureCenter(id, cur, note) {
    if (cur !== "center") {
        lines.push(`SET ${id} stackAlignment="center";`)
        notes.push(note)
    }
}

function bumpTo1440(n, label) {
    const mw = n.attributes?.maxWidth
    if (mw === "1440px") return
    if (mw === "1200px" || mw === "1040px" || !mw) {
        // only bump known content caps / missing on wrappers we target
        if (mw === "1200px" || mw === "1040px") {
            setMax(n.id, "1440px", `${label} ${mw}→1440`)
        }
    }
}

for (const path of CONTENT) {
    const p = pages.find((x) => x.path === path)
    if (!p) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 4 }, {})
    for (const bp of ser.children || []) {
        for (const c of bp.children || []) {
            const name = c.name || ""
            const a = c.attributes || {}
            if (SKIP_TOP.test(name)) continue

            // Full-bleed hero/cinematic shells — keep uncapped; bump inner content
            if (FULL_BLEED_SHELL.test(name)) {
                if (a.maxWidth) clearMax(c.id, `${path}|${bp.name}|${name} clear shell maxW`)
                ensureWidthFull(c.id, a.width, `${path}|${bp.name}|${name} width→100%`)
                ensureCenter(c.id, a.stackAlignment, `${path}|${bp.name}|${name} align→center`)
                const walk = (n, d = 0) => {
                    if (!n || d > 4) return
                    const nm = n.name || ""
                    if (
                        /Text Content Column|Image Editorial Overlay|Hero Copy|Content Column/i.test(
                            nm,
                        )
                    ) {
                        const mw = n.attributes?.maxWidth
                        if (mw !== "1440px") {
                            setMax(
                                n.id,
                                "1440px",
                                `${path}|${bp.name}|${name}>${nm} →1440`,
                            )
                        }
                    }
                    // bump nested 1200 wrappers inside hero
                    if (n.attributes?.maxWidth === "1200px") {
                        setMax(
                            n.id,
                            "1440px",
                            `${path}|${bp.name}|${name}>${nm || n.id} 1200→1440`,
                        )
                    }
                    for (const ch of n.children || []) walk(ch, d + 1)
                }
                walk(c)
                continue
            }

            const filled = hasFill(a)
            const mw = a.maxWidth

            if (filled) {
                // Full-bleed background shell
                if (mw) {
                    clearMax(c.id, `${path}|${bp.name}|${name} clear maxW (filled BG)`)
                }
                ensureWidthFull(
                    c.id,
                    a.width === "1fr" ? "1fr" : a.width,
                    `${path}|${bp.name}|${name} width full`,
                )
                // keep 1fr as-is; if fixed px width, force 100%
                if (a.width && /^\d/.test(a.width)) {
                    lines.push(`SET ${c.id} width="100%";`)
                    notes.push(`${path}|${bp.name}|${name} fixedW→100%`)
                }
                ensureCenter(c.id, a.stackAlignment, `${path}|${bp.name}|${name} align→center`)

                // Cap direct children content
                for (const ch of c.children || []) {
                    const cmw = ch.attributes?.maxWidth
                    if (cmw === "1440px") continue
                    // skip absolute decorative layers
                    if (ch.attributes?.position === "absolute") continue
                    setMax(
                        ch.id,
                        "1440px",
                        `${path}|${bp.name}|${name}>${ch.name || ch.id} →1440`,
                    )
                    if (
                        ch.attributes?.width !== "1fr" &&
                        ch.attributes?.width !== "100%" &&
                        ch.attributes?.width !== "auto"
                    ) {
                        lines.push(`SET ${ch.id} width="1fr";`)
                    }
                }
            } else {
                // Content section without own fill — maxWidth 1440 on shell
                if (mw === "1200px" || mw === "1040px" || !mw) {
                    // only set if it looks like a content section
                    const pad = String(a.padding || "")
                    const named =
                        /Section|Journal|Manifesto|Opening|Chapter|Enquiry|Contact|Portfolio|Process|Recognition|Testimonial|Stats|Particulars|Gallery|Setting|Search|Strip|Pause|Beat|Content|Hero|Closing|Specs|Article|Column|Bottom/i.test(
                            name,
                        )
                    if (named || /\d+px/.test(pad)) {
                        if (mw !== "1440px") {
                            setMax(
                                c.id,
                                "1440px",
                                `${path}|${bp.name}|${name} ${mw || "NONE"}→1440`,
                            )
                        }
                    }
                } else if (mw === "1440px") {
                    // ok
                } else if (mw && mw !== "100%") {
                    // leave intentional narrower text maxWidths on nested later
                }
            }

            // Bump nested 1200 content wrappers one level down (Content Area, etc.)
            for (const ch of c.children || []) {
                if (ch.attributes?.maxWidth === "1200px") {
                    setMax(
                        ch.id,
                        "1440px",
                        `${path}|${bp.name}|${name}>${ch.name || "child"} 1200→1440`,
                    )
                }
                for (const g of ch.children || []) {
                    if (g.attributes?.maxWidth === "1200px") {
                        setMax(
                            g.id,
                            "1440px",
                            `${path}|${bp.name}|…>${g.name || "g"} 1200→1440`,
                        )
                    }
                }
            }
        }
    }
}

// Footer component: Grid + bar 1200 → 1440
const footerComp = comps.find((c) => c.name === "Footer")
if (footerComp) {
    const ser = await framer.agent.serialize({ id: footerComp.id, depth: 3 }, {})
    for (const bp of ser.children || []) {
        for (const c of bp.children || []) {
            const name = c.name || "(bar)"
            if (/Rail|Mesh|Atmosphere/i.test(name)) continue
            if (c.attributes?.maxWidth === "1200px" || /Editorial Grid/i.test(name) || !c.name) {
                if (c.attributes?.maxWidth !== "1440px") {
                    setMax(c.id, "1440px", `FooterComp|${bp.name}|${name} →1440`)
                }
            }
        }
    }
}

// Dedupe SET lines (same id+prop last wins — keep unique by full line)
const seen = new Set()
const uniq = []
for (const line of lines) {
    if (seen.has(line)) continue
    seen.add(line)
    uniq.push(line)
}

if (!uniq.length) return { applied: 0, notes: ["noop"] }

// apply in chunks to avoid huge payloads
const chunkSize = 40
const results = []
for (let i = 0; i < uniq.length; i += chunkSize) {
    const chunk = uniq.slice(i, i + chunkSize)
    const r = await framer.agent.applyChanges(chunk.join("\n"), {})
    results.push(r?.message || r)
}

return {
    applied: uniq.length,
    notes: notes.slice(0, 80),
    noteCount: notes.length,
    results,
}

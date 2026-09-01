/**
 * Strict verify: BGs full-bleed; content sections have maxWidth.
 * Content heroes (Contact/Property with pad+maxWidth) are OK — not full-bleed BGs.
 * Full-bleed: Atmosphere/Noise/Blur/Mesh, Footer shell, Home Hero shell, Beat 2 cinematic shell.
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

const bgViolations = []
const sectionMissing = []
const sectionOk = []
const footerReport = []

const FIXED = /^(1200|810|390|1440)px$/

function checkBg(path, bp, n, label) {
    const a = n.attributes || {}
    if (a.maxWidth) {
        bgViolations.push({
            path,
            bp,
            name: label,
            id: n.id,
            issue: `BG maxWidth=${a.maxWidth}`,
        })
    }
    if (a.width && FIXED.test(a.width)) {
        bgViolations.push({
            path,
            bp,
            name: label,
            id: n.id,
            issue: `BG fixed width=${a.width}`,
        })
    }
}

function walkBgLayers(path, bp, n, d = 0) {
    if (!n || d > 4) return
    if (/Atmosphere|Noise|Blur|Mesh/i.test(n.name || "")) {
        checkBg(path, bp, n, n.name)
    }
    for (const c of n.children || []) walkBgLayers(path, bp, c, d + 1)
}

for (const path of CONTENT) {
    const p = pages.find((x) => x.path === path)
    if (!p) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 4 }, {})
    for (const bp of ser.children || []) {
        for (const c of bp.children || []) {
            const name = c.name || ""
            const a = c.attributes || {}

            // BG layers anywhere under top shells
            walkBgLayers(path, bp.name, c)

            if (name === "Footer") {
                checkBg(path, bp.name, c, "Footer shell")
                continue
            }

            // Home-style full-bleed hero shell
            if (name === "Hero Section") {
                checkBg(path, bp.name, c, name)
                const walk = (n, d = 0) => {
                    if (!n || d > 4) return
                    if (n.name === "Text Content Column") {
                        if (!n.attributes?.maxWidth) {
                            sectionMissing.push({
                                path,
                                bp: bp.name,
                                name: `${name}>${n.name}`,
                                id: n.id,
                            })
                        } else sectionOk.push(`${path}|${bp.name}|${n.name}|${n.attributes.maxWidth}`)
                    }
                    for (const ch of n.children || []) walk(ch, d + 1)
                }
                walk(c)
                continue
            }

            // Cinematic full-bleed
            if (/Beat 2|Cinematic Image/i.test(name)) {
                checkBg(path, bp.name, c, name)
                for (const ch of c.children || []) {
                    if (/Overlay|Editorial/i.test(ch.name || "")) {
                        if (ch.attributes?.maxWidth !== "1200px") {
                            sectionMissing.push({
                                path,
                                bp: bp.name,
                                name: ch.name,
                                id: ch.id,
                            })
                        } else sectionOk.push(`${path}|${bp.name}|${ch.name}|1200px`)
                    }
                }
                continue
            }

            if (/Nav|Cue/i.test(name)) continue

            // Content sections: pad with horiz gutter OR known names
            const pad = String(a.padding || "")
            const parts = pad.match(/([\d.]+)px/g) || []
            let lr = null
            if (parts.length === 1) lr = parseFloat(parts[0])
            else if (parts.length === 2) lr = parseFloat(parts[1])
            else if (parts.length === 3) lr = parseFloat(parts[1])
            else if (parts.length === 4)
                lr = Math.min(parseFloat(parts[1]), parseFloat(parts[3]))
            const hasHorizPad = lr != null && lr > 0
            const named =
                /Section|Journal|Manifesto|Opening|Chapter|Enquiry|Contact|Portfolio|Process|Recognition|Testimonial|Stats|Particulars|Gallery|Setting|Search|Strip|Pause|Beat|Content|Hero|Closing|Specs|Article|Column|Bottom/i.test(
                    name,
                )

            if (hasHorizPad || named) {
                if (!a.maxWidth) {
                    sectionMissing.push({
                        path,
                        bp: bp.name,
                        name,
                        id: c.id,
                        pad: a.padding,
                        w: a.width,
                    })
                } else {
                    sectionOk.push(`${path}|${bp.name}|${name}|${a.maxWidth}`)
                }
            }
        }
    }
}

const footerComp = comps.find((c) => c.name === "Footer")
if (footerComp) {
    const ser = await framer.agent.serialize({ id: footerComp.id, depth: 3 }, {})
    for (const bp of ser.children || []) {
        checkBg("FooterComp", bp.name, bp, "variant root")
        const kids = []
        for (const c of bp.children || []) {
            const name = c.name || "(bar)"
            kids.push({
                name,
                maxW: c.attributes?.maxWidth || null,
                w: c.attributes?.width || null,
            })
            if (/Rail|Mesh|Atmosphere/i.test(name)) {
                checkBg("FooterComp", bp.name, c, name)
            } else if (/Editorial Grid/i.test(name) || !c.name) {
                if (c.attributes?.maxWidth !== "1200px") {
                    sectionMissing.push({
                        path: "FooterComp",
                        bp: bp.name,
                        name,
                        id: c.id,
                    })
                } else sectionOk.push(`FooterComp|${bp.name}|${name}|1200px`)
            }
        }
        footerReport.push({
            bp: bp.name,
            rootMax: bp.attributes?.maxWidth || null,
            align: bp.attributes?.stackAlignment,
            kids,
        })
    }
}

return {
    pass: bgViolations.length === 0 && sectionMissing.length === 0,
    bgViolations,
    sectionMissing,
    sectionOkCount: sectionOk.length,
    desktopOk: sectionOk.filter((s) => s.includes("Desktop")),
    footerReport,
}

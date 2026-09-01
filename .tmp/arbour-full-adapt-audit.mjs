/**
 * Full-site adaptation audit: every content page × all BPs.
 * Flag: missing 90% on content, filled shells with maxW, fixed px heights >= 120 on media-like nodes.
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
const report = { pages: [], fixedHeights: [], maxWIssues: [], topSummary: [] }

function hasFill(a = {}) {
    const f = a.backgroundColor ?? a.fill ?? null
    return !!(f && f !== "null" && f !== "none" && f !== "")
}

function walkHeights(n, path, bp, d = 0) {
    if (!n || d > 7) return
    const a = n.attributes || {}
    const h = a.height
    if (h && /^\d+(\.\d+)?px$/.test(String(h))) {
        const nH = parseFloat(h)
        if (nH >= 120) {
            report.fixedHeights.push({
                path,
                bp,
                name: n.name || "(unnamed)",
                id: n.id,
                h: nH,
                w: a.width ?? null,
                maxW: a.maxWidth ?? null,
                trail: path,
            })
        }
    }
    for (const c of n.children || []) {
        walkHeights(c, `${path}/${n.name || "?"}`, bp, d + 1)
    }
}

for (const path of CONTENT) {
    const p = pages.find((x) => x.path === path)
    if (!p) {
        report.pages.push({ path, missing: true })
        continue
    }
    const ser = await framer.agent.serialize({ id: p.id, depth: 3 }, {})
    const pageEntry = { path, breakpoints: [] }

    for (const bp of ser.children || []) {
        const tops = []
        for (const c of bp.children || []) {
            const name = c.name || ""
            if (/Atmosphere|Nav|Cue|ScrollCue/i.test(name)) continue
            const a = c.attributes || {}
            const filled = hasFill(a)
            const mw = a.maxWidth || null
            const h = a.height || null
            tops.push({
                name,
                id: c.id,
                mw,
                w: a.width || null,
                h,
                filled,
                pad: a.padding || null,
                kids: (c.children || []).slice(0, 8).map((ch) => ({
                    name: ch.name || "(x)",
                    id: ch.id,
                    mw: ch.attributes?.maxWidth || null,
                    w: ch.attributes?.width || null,
                    h: ch.attributes?.height || null,
                    pos: ch.attributes?.position || null,
                })),
            })

            // Issues
            if (name === "Footer") {
                if (mw) {
                    report.maxWIssues.push({
                        path,
                        bp: bp.name,
                        name,
                        issue: `Footer shell maxW=${mw}`,
                        id: c.id,
                    })
                }
                continue
            }
            if (/Hero Section|Beat 2|Cinematic Image/i.test(name)) {
                // full-bleed shell OK without 90
                if (h && String(h).endsWith("px") && parseFloat(h) >= 200) {
                    report.maxWIssues.push({
                        path,
                        bp: bp.name,
                        name,
                        issue: `full-bleed media still fixed px height=${h}`,
                        id: c.id,
                    })
                }
                continue
            }

            if (filled) {
                if (mw) {
                    report.maxWIssues.push({
                        path,
                        bp: bp.name,
                        name,
                        issue: `filled BG has maxW=${mw}`,
                        id: c.id,
                    })
                }
                for (const ch of c.children || []) {
                    if (ch.attributes?.position === "absolute") continue
                    if (ch.attributes?.maxWidth !== "90%") {
                        report.maxWIssues.push({
                            path,
                            bp: bp.name,
                            name: `${name}>${ch.name || ch.id}`,
                            issue: `content child maxW=${ch.attributes?.maxWidth || "NONE"}`,
                            id: ch.id,
                        })
                    }
                }
            } else {
                const named =
                    /Section|Journal|Manifesto|Opening|Chapter|Enquiry|Contact|Portfolio|Process|Recognition|Testimonial|Stats|Particulars|Gallery|Setting|Search|Strip|Pause|Beat|Content|Hero|Closing|Specs|Article|Column|Bottom/i.test(
                        name,
                    )
                if (named && mw !== "90%" && mw !== "100%") {
                    report.maxWIssues.push({
                        path,
                        bp: bp.name,
                        name,
                        issue: `section maxW=${mw || "NONE"}`,
                        id: c.id,
                    })
                }
            }

            // shell fixed px height
            if (h && String(h).endsWith("px") && parseFloat(h) >= 200) {
                report.maxWIssues.push({
                    path,
                    bp: bp.name,
                    name,
                    issue: `section fixed height=${h}`,
                    id: c.id,
                })
            }
        }
        pageEntry.breakpoints.push({ bp: bp.name, tops })
        // deep heights for this BP
        for (const c of bp.children || []) {
            if (/Atmosphere|Nav|Cue/i.test(c.name || "")) continue
            walkHeights(c, `${path}|${bp.name}|${c.name}`, bp.name, 0)
        }
    }
    report.pages.push(pageEntry)
}

// Desktop-only top summary for readability
for (const pe of report.pages) {
    if (pe.missing) continue
    const desk = pe.breakpoints.find((b) => b.bp === "Desktop")
    if (!desk) continue
    report.topSummary.push({
        path: pe.path,
        sections: desk.tops.map((t) => ({
            name: t.name,
            mw: t.mw,
            h: t.h,
            filled: t.filled,
            kidMax: t.kids.map((k) => `${k.name}:${k.mw || "-"}/${k.h || "-"}`),
        })),
    })
}

report.fixedHeights.sort((a, b) => b.h - a.h)
report.fixedHeightsDesktop = report.fixedHeights
    .filter((h) => h.bp === "Desktop")
    .slice(0, 60)

return {
    maxWIssueCount: report.maxWIssues.length,
    maxWIssues: report.maxWIssues.slice(0, 80),
    fixedDesktop: report.fixedHeightsDesktop,
    fixedDesktopCount: report.fixedHeights.filter((h) => h.bp === "Desktop").length,
    topSummary: report.topSummary,
}
